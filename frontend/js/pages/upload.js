const UploadPage = (() => {
  let selectedFile = null;

  function render() {
    document.getElementById('page-upload').innerHTML = `
      <div class="page-header">
        <h2>Upload Document</h2>
        <p>Process a PDF into the vector store so you can chat with it</p>
      </div>

      <div class="drop-zone" id="dropZone">
        <input type="file" id="fileInput" accept=".pdf"/>
        <div class="drop-icon">📄</div>
        <h3>Drop your PDF here</h3>
        <p>or click to browse</p>
        <span class="drop-hint">Only .pdf files accepted</span>
      </div>

      <div class="file-row" id="fileRow">
        <div class="file-type-icon">📄</div>
        <div class="file-meta">
          <div class="fn" id="fileName">—</div>
          <div class="fs" id="fileSize">—</div>
        </div>
        <button class="remove-file-btn" id="removeFileBtn" title="Remove">✕</button>
      </div>

      <div class="progress-wrap" id="progressWrap">
        <div class="progress-bar" id="progressBar"></div>
      </div>

      <button class="btn btn-primary btn-full" id="uploadBtn" disabled style="margin-top:12px">
        Select a file first
      </button>

      <div class="alert" id="uploadAlert"></div>

      <div class="docid-result" id="docidResult">
        <div class="label">Document ID — paste this in the Chat tab</div>
        <div class="id-val" id="docIdVal">—</div>
        <div class="docid-actions">
          <button class="btn btn-ghost btn-sm" id="copyIdBtn">📋 Copy ID</button>
          <button class="btn btn-primary btn-sm" id="goChatBtn">💬 Chat with this doc →</button>
        </div>
      </div>

      <div class="prev-uploads" id="prevUploads">
        <h3>Previously uploaded</h3>
        <div id="prevList"></div>
      </div>
    `;

    bindEvents();
    renderPrevList();
  }

  function bindEvents() {
    const dz       = document.getElementById('dropZone');
    const fileInput= document.getElementById('fileInput');
    const uploadBtn= document.getElementById('uploadBtn');
    const removeBtn= document.getElementById('removeFileBtn');
    const copyBtn  = document.getElementById('copyIdBtn');
    const chatBtn  = document.getElementById('goChatBtn');

    dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('drag-over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('drag-over');
      const f = e.dataTransfer.files[0];
      if (f) setFile(f);
    });
    dz.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => { if (e.target.files[0]) setFile(e.target.files[0]); });
    fileInput.addEventListener('click', e => e.stopPropagation());

    removeBtn.addEventListener('click', clearFile);
    uploadBtn.addEventListener('click', doUpload);
    copyBtn  && copyBtn.addEventListener('click',  () => {
      navigator.clipboard.writeText(document.getElementById('docIdVal').textContent);
      showToast('Doc ID copied!', 'success');
    });
    chatBtn  && chatBtn.addEventListener('click', () => {
      Router.go('chat');
    });
  }

  function setFile(file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF files are supported', 'error'); return;
    }
    selectedFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = (file.size / 1024).toFixed(1) + ' KB';
    document.getElementById('fileRow').classList.add('show');
    document.getElementById('uploadBtn').disabled = false;
    document.getElementById('uploadBtn').textContent = '⬆ Upload & Process PDF';
    hideAlert();
    document.getElementById('docidResult').classList.remove('show');
  }

  function clearFile() {
    selectedFile = null;
    document.getElementById('fileRow').classList.remove('show');
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('uploadBtn').textContent = 'Select a file first';
    document.getElementById('fileInput').value = '';
  }

  async function doUpload() {
    if (!selectedFile) return;
    const btn = document.getElementById('uploadBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Processing…';
    document.getElementById('progressWrap').classList.add('show');
    hideAlert();

    try {
      const data = await API.uploadPDF(selectedFile, pct => {
        document.getElementById('progressBar').style.width = pct + '%';
      });

      // Save to store
      Store.addDoc({
        doc_id:      data.doc_id,
        filename:    data.filename,
        chunk_count: data.chunk_count,
        uploaded_at: new Date().toLocaleTimeString(),
      });
      Store.setActiveDoc(data.doc_id);

      document.getElementById('docIdVal').textContent = data.doc_id;
      document.getElementById('docidResult').classList.add('show');
      showAlert('uploadAlert', `✓ ${data.chunk_count} chunks created successfully`, 'success');
      btn.textContent = '✓ Done! Upload another';
      btn.disabled = false;
      renderPrevList();
      showToast('Document processed!', 'success');
    } catch (err) {
      showAlert('uploadAlert', '✕ ' + err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Retry Upload';
    } finally {
      setTimeout(() => {
        document.getElementById('progressWrap').classList.remove('show');
        document.getElementById('progressBar').style.width = '0';
      }, 800);
    }
  }

  function showAlert(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = `alert show ${type}`;
  }
  function hideAlert() {
    const el = document.getElementById('uploadAlert');
    if (el) el.classList.remove('show');
  }

  function renderPrevList() {
    const el = document.getElementById('prevList');
    if (!el) return;
    const docs = Store.getDocs();
    if (!docs.length) { el.innerHTML = '<p style="font-size:13px;color:var(--text2)">None yet.</p>'; return; }
    el.innerHTML = docs.map(d => `
      <div class="upload-doc-item ${Store.getActiveDoc()===d.doc_id?'active':''}" data-id="${d.doc_id}">
        <span style="font-size:17px">📄</span>
        <span class="udi-name">${d.filename}</span>
        <span class="udi-chunks">${d.chunk_count} chunks</span>
        <span class="udi-check">✓</span>
      </div>
    `).join('');

    el.querySelectorAll('.upload-doc-item').forEach(item => {
      item.addEventListener('click', () => {
        Store.setActiveDoc(item.dataset.id);
        document.getElementById('docIdVal').textContent = item.dataset.id;
        document.getElementById('docidResult').classList.add('show');
        renderPrevList();
      });
    });
  }

  function onActivate() { renderPrevList(); }

  return { render, onActivate };
})();