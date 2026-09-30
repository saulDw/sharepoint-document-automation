const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Packer, Document, Paragraph, TextRun } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_DIR = path.join(__dirname, 'output');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  return content ? JSON.parse(content) : [];
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function findItemById(items, id) {
  return items.find((item) => item.id === id);
}

function parseTemplateVariables(templateText) {
  const variableMatches = templateText.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g) || [];
  return [...new Set(variableMatches.map((item) => item.replace(/[{}]/g, '').trim()))];
}

function replaceTemplateVariables(templateText, record) {
  return templateText.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = record[key] ?? '';
    return String(value);
  });
}

async function generateWordDocument(template, record) {
  const sections = [];
  const lines = template.content.split(/\r?\n/).filter((line) => line.trim() !== '');

  const children = lines.map((line) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: replaceTemplateVariables(line, record),
          size: 24
        })
      ]
    });
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'SharePoint Document Automation' });
});

app.get('/api/records', (req, res) => {
  const records = readJson(RECORDS_FILE);
  res.json(records);
});

app.post('/api/records', (req, res) => {
  const records = readJson(RECORDS_FILE);
  const payload = req.body || {};

  const newRecord = {
    id: payload.id || uuidv4(),
    name: payload.name || 'New record',
    projectName: payload.projectName || '',
    clientName: payload.clientName || '',
    dueDate: payload.dueDate || '',
    owner: payload.owner || '',
    status: payload.status || 'Draft',
    summary: payload.summary || '',
    budget: payload.budget || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  records.push(newRecord);
  writeJson(RECORDS_FILE, records);
  res.status(201).json(newRecord);
});

app.put('/api/records/:id', (req, res) => {
  const records = readJson(RECORDS_FILE);
  const recordIndex = records.findIndex((record) => record.id === req.params.id);

  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  records[recordIndex] = {
    ...records[recordIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeJson(RECORDS_FILE, records);
  res.json(records[recordIndex]);
});

app.delete('/api/records/:id', (req, res) => {
  const records = readJson(RECORDS_FILE);
  const filtered = records.filter((record) => record.id !== req.params.id);
  writeJson(RECORDS_FILE, filtered);
  res.json({ message: 'Record deleted' });
});

app.get('/api/templates', (req, res) => {
  const templates = readJson(TEMPLATES_FILE);
  res.json(templates);
});

app.post('/api/templates', (req, res) => {
  const templates = readJson(TEMPLATES_FILE);
  const payload = req.body || {};

  const newTemplate = {
    id: payload.id || uuidv4(),
    name: payload.name || 'New Template',
    description: payload.description || '',
    content: payload.content || 'Hello {{projectName}}',
    fields: payload.fields || parseTemplateVariables(payload.content || 'Hello {{projectName}}'),
    createdAt: new Date().toISOString()
  };

  templates.push(newTemplate);
  writeJson(TEMPLATES_FILE, templates);
  res.status(201).json(newTemplate);
});

app.get('/api/sharepoint-export/:id', (req, res) => {
  const records = readJson(RECORDS_FILE);
  const templates = readJson(TEMPLATES_FILE);
  const record = findItemById(records, req.params.id);

  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const payload = {
    source: 'sharepoint-document-automation',
    recordId: record.id,
    recordName: record.name,
    fields: record,
    templates: templates.map((template) => ({
      id: template.id,
      name: template.name,
      fields: template.fields
    }))
  };

  res.json(payload);
});

app.post('/api/documents/generate', async (req, res) => {
  const records = readJson(RECORDS_FILE);
  const templates = readJson(TEMPLATES_FILE);
  const { recordId, templateId } = req.body || {};

  const record = findItemById(records, recordId);
  const template = findItemById(templates, templateId);

  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  const docBuffer = await generateWordDocument(template, record);
  const safeName = `${record.name || 'document'}-${template.name || 'template'}`.replace(/[^a-z0-9-_ ]/gi, '').trim();
  const fileName = `${safeName}.docx`;
  const outputPath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(outputPath, docBuffer);

  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(docBuffer);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureDirectories();

if (!fs.existsSync(RECORDS_FILE)) {
  const seededRecords = [
    {
      id: 'sample-record-1',
      name: 'Q4 Client Launch',
      projectName: 'Nordic Launch',
      clientName: 'Northwind Group',
      dueDate: '2026-10-15',
      owner: 'S. De Vries',
      status: 'In review',
      summary: 'Launch plan and sign-off package for the Nordic account expansion.',
      budget: '€84,000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  writeJson(RECORDS_FILE, seededRecords);
}

if (!fs.existsSync(TEMPLATES_FILE)) {
  const seededTemplates = [
    {
      id: 'template-brief',
      name: 'Client Brief',
      description: 'Summary sheet for a customer project introduction.',
      fields: ['projectName', 'clientName', 'dueDate', 'owner', 'status', 'summary'],
      content: [
        'Client Brief',
        '',
        'Project: {{projectName}}',
        'Client: {{clientName}}',
        'Due Date: {{dueDate}}',
        'Project Owner: {{owner}}',
        'Status: {{status}}',
        '',
        'Summary:',
        '{{summary}}'
      ].join('\n')
    },
    {
      id: 'template-approval',
      name: 'Approval Letter',
      description: 'Approval statement for internal sign-off.',
      fields: ['clientName', 'projectName', 'dueDate', 'owner', 'budget'],
      content: [
        'Approval Letter',
        '',
        'This letter confirms approval for the {{projectName}} project for {{clientName}}.',
        'The final delivery date is {{dueDate}}.',
        'The project is assigned to {{owner}} and has a budget of {{budget}}.',
        '',
        'We confirm the project is ready for the next phase.'
      ].join('\n')
    }
  ];
  writeJson(TEMPLATES_FILE, seededTemplates);
}

app.listen(PORT, () => {
  console.log(`SharePoint Document Automation app running on http://localhost:${PORT}`);
});
