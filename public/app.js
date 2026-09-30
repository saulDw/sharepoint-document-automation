<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SharePoint Document Automation</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="app-shell">
      <aside class="sidebar">
        <h1>Document Flow</h1>
        <p class="subtitle">Automate Word templates using structured data and SharePoint.</p>

        <div class="panel">
          <h3>Templates</h3>
          <select id="templateSelect"></select>
          <button id="generateBtn">Generate Word document</button>
          <button id="syncBtn" class="secondary">Sync to SharePoint</button>
          <p id="downloadResult" class="result-text"></p>
        </div>

        <div class="panel sharepoint-panel">
          <h3>SharePoint connection</h3>
          <form id="sharepointConfigForm" class="sharepoint-form">
            <label><span>Enabled</span><input id="sharepointEnabled" type="checkbox" /></label>
            <input id="sharepointSiteUrl" type="url" placeholder="https://contoso.sharepoint.com/sites/Projects" />
            <input id="sharepointListName" type="text" placeholder="ProjectDocuments" />
            <input id="sharepointTenantId" type="text" placeholder="Azure tenant ID" />
            <input id="sharepointClientId" type="text" placeholder="Azure app client ID" />
            <input id="sharepointClientSecret" type="password" placeholder="Azure app client secret" />
            <button type="submit" class="secondary">Save SharePoint config</button>
          </form>
        </div>
      </aside>

      <main class="main-panel">
        <div class="topbar">
          <h2>Important data list</h2>
          <button id="newRecordBtn" class="secondary">New record</button>
        </div>

        <div class="status" id="statusText">Loading...</div>

        <form id="recordForm" class="form-grid">
          <div>
            <label for="name">Record name</label>
            <input id="name" name="name" type="text" placeholder="e.g. Q4 Client Launch" />
          </div>

          <div>
            <label for="projectName">Project name</label>
            <input id="projectName" name="projectName" type="text" placeholder="Project name" />
          </div>

          <div>
            <label for="clientName">Client name</label>
            <input id="clientName" name="clientName" type="text" placeholder="Client name" />
          </div>

          <div>
            <label for="dueDate">Due date</label>
            <input id="dueDate" name="dueDate" type="date" />
          </div>

          <div>
            <label for="owner">Owner</label>
            <input id="owner" name="owner" type="text" placeholder="Assigned owner" />
          </div>

          <div>
            <label for="status">Status</label>
            <select id="status" name="status">
              <option value="Draft">Draft</option>
              <option value="In review">In review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="full-width">
            <label for="summary">Summary</label>
            <textarea id="summary" name="summary" rows="4" placeholder="Enter the summary or context"></textarea>
          </div>

          <div>
            <label for="budget">Budget</label>
            <input id="budget" name="budget" type="text" placeholder="e.g. €84,000" />
          </div>

          <div class="full-width form-actions">
            <button type="submit">Save record</button>
          </div>
        </form>

        <section class="records-section">
          <h3>Saved data</h3>
          <div id="recordList" class="record-list"></div>
        </section>
      </main>
    </div>

    <script src="/app.js"></script>
  </body>
</html>
