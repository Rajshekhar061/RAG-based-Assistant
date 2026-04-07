const DocsPage = (() => {
  function render() {
    document.getElementById('page-docs').innerHTML = `
      <div class="page-header">
        <h2>My Documents</h2>
        <p>All documents processed this session</p>
      </div>
      <div class="docs-statsbar" id="docsStatsBar"></div>
      <div id="docsGrid" class="docs-grid"></div>
      <div class="empty-state" id="docsEmpty" style="display:none">
        <div class="es-icon">📭</div>
        <h3>No documents yet</h3>
        <p>Upload a PDF to get started</p>
        <button class="btn btn-primary" style="margin-top:14px" id="goUploadBtn">Upload PDF</button>
      </div>
    `;

    document.getElementById('goUploadBtn')?.addEventListener('click', () => Router.go('upload'));
    renderDocs();
  }

  function renderDocs() {
    const docs = Store.getDocs();
    const grid  = document.getElementById('docsGrid');
    const empty = document.getElementById('docsEmpty');
    const stats = document.getElementById('docsStatsBar');

    const totalChunks = docs.reduce((s, d) => s + (d.chunk_count || 0), 0);
    stats.innerHTML = `
      <div class="stat-box"><div class="sv">${docs.length}</div><div class="sl">Documents</div></div>
      <div class="stat-box"><div class="sv">${totalChunks}</div><div class="sl">Total chunks</div></div>
      <div class="stat-box"><div class="sv">${Store.isApiOnline() ? '🟢' : '🔴'}</div><div class="sl">API status</div></div>
    `;

    if (!docs.length) {
      grid.style.display  = 'none';
      empty.style.display = 'flex';
      return;
    }
    grid.style.display  = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = docs.map(d => `
      <div class="doc-card">
        <div class="dc-head">
          <div class="dc-file-icon">📄</div>
          <div class="dc-name" title="${escHtml(d.filename)}">${escHtml(d.filename)}</div>
        </div>
        <div class="dc-stats">
          <span><b>${d.chunk_count}</b> chunks</span>
          <span>uploaded ${escHtml(d.uploaded_at || '—')}</span>
        </div>
        <div class="dc-id-row" title="${escHtml(d.doc_id)}">${escHtml(d.doc_id)}</div>
        <div class="dc-actions">
          <button class="btn btn-ghost" data-copy="${escHtml(d.doc_id)}">📋 Copy ID</button>
          <button class="btn btn-primary" data-chat="${escHtml(d.doc_id)}">💬 Chat</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy);
        showToast('Doc ID copied!', 'success');
      });
    });

    grid.querySelectorAll('[data-chat]').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.setActiveDoc(btn.dataset.chat);
        Router.go('chat');
      });
    });
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function onActivate() { renderDocs(); }

  return { render, onActivate };
})();