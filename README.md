:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --primary: #1b5bd2;
  --primary-dark: #1143a3;
  --accent: #ecf2ff;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #dfe7f2;
  --success: #0b8d55;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0e1d39;
  color: #fff;
  padding: 24px;
}

.sidebar h1 {
  margin-top: 0;
  font-size: 2rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 32px;
}

.panel {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 18px;
  border-radius: 12px;
}

.panel h3 {
  margin-top: 0;
}

.panel select,
.panel button {
  width: 100%;
  margin-top: 10px;
}

.main-panel {
  padding: 32px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.status {
  background: var(--accent);
  border-left: 4px solid var(--primary);
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 18px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
}

.form-grid label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: var(--primary-dark);
}

button.secondary {
  background: #eaf1ff;
  color: var(--text);
}

button.secondary:hover {
  background: #dfeaff;
}

.records-section {
  margin-top: 30px;
}

.record-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 18px;
}

.record-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
}

.record-card h4 {
  margin-top: 0;
}

.result-text {
  color: var(--success);
  font-weight: 600;
  margin-top: 12px;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

