const ChatPage = (() => {
  let chatHistory = [];   // { role, text, sources }
  let isLoading   = false;

  function render() {
    document.getElementById('page-chat').innerHTML = `
      <div class="chat-wrap">
        <div class="chat-topbar">
          <label>Document:</label>
          <select class="doc-select" id="docSelect">
            <option value="">— select a document —</option>
          </select>
          <button class="btn btn-ghost btn-sm" id="clearChatBtn">Clear chat</button>
        </div>

        <div class="messages-area" id="messagesArea">
          <div class="chat-empty" id="chatEmpty">
            <div class="ce-icon">💬</div>
            <h3>Ready to answer your questions</h3>
            <p>Select a document above, then ask anything about its content.</p>
            <div class="suggestion-chips" id="suggestionChips">
              <button class="s-chip">Summarize this document</button>
              <button class="s-chip">What are the key points?</button>
              <button class="s-chip">List the main topics</button>
              <button class="s-chip">What conclusions are drawn?</button>
            </div>
          </div>
        </div>

        <div class="chat-inputbar">
          <textarea
            class="chat-textarea"
            id="chatInput"
            placeholder="Ask something about your document…"
            rows="1"
          ></textarea>
          <button class="send-btn" id="sendBtn" disabled title="Send">➤</button>
        </div>
      </div>
    `;

    bindEvents();
    populateDocSelect();
  }

  function bindEvents() {
    document.getElementById('clearChatBtn').addEventListener('click', clearChat);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('docSelect').addEventListener('change', e => {
      Store.setActiveDoc(e.target.value || null);
      updateSendBtn();
    });

    const input = document.getElementById('chatInput');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      updateSendBtn();
    });

    document.getElementById('suggestionChips').querySelectorAll('.s-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.getElementById('chatInput').value = chip.textContent;
        sendMessage();
      });
    });
  }

  function populateDocSelect() {
    const sel = document.getElementById('docSelect');
    if (!sel) return;
    const docs = Store.getDocs();
    const active = Store.getActiveDoc();
    sel.innerHTML = '<option value="">— select a document —</option>';
    docs.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.doc_id;
      opt.textContent = d.filename;
      if (d.doc_id === active) opt.selected = true;
      sel.appendChild(opt);
    });
    updateSendBtn();
  }

  function updateSendBtn() {
    const input   = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const docSel  = document.getElementById('docSelect');
    if (!sendBtn) return;
    sendBtn.disabled = isLoading || !docSel?.value || !input?.value.trim();
  }

  async function sendMessage() {
    const input  = document.getElementById('chatInput');
    const docSel = document.getElementById('docSelect');
    const q = input?.value.trim();
    const docId = docSel?.value;
    if (!q || !docId || isLoading) return;

    // Clear empty state
    const empty = document.getElementById('chatEmpty');
    if (empty) empty.remove();

    appendMsg('user', q);
    input.value = '';
    input.style.height = 'auto';
    isLoading = true;
    updateSendBtn();
    appendTyping();

    try {
      const data = await API.chat(docId, q);
      removeTyping();
      appendMsg('ai', data.answer, data.sources || []);
    } catch (err) {
      removeTyping();
      appendMsg('ai', `⚠ Error: ${err.message}`, []);
    } finally {
      isLoading = false;
      updateSendBtn();
    }
  }

  function appendMsg(role, text, sources = []) {
    const area = document.getElementById('messagesArea');
    const div  = document.createElement('div');
    div.className = `msg ${role}`;

    const avatar = role === 'user' ? 'U' : '🧠';
    const sourcesHtml = sources.length ? `
      <div class="msg-sources">
        <div class="sources-label">Sources used</div>
        ${sources.slice(0,3).map(s => `<span class="source-chip" title="${escHtml(s)}">${escHtml(s.slice(0,60))}…</span>`).join('')}
      </div>
    ` : '';

    div.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-content">
        <div class="msg-bubble">
          ${escHtml(text).replace(/\n/g,'<br/>')}
          ${role === 'ai' ? sourcesHtml : ''}
        </div>
      </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  }

  function appendTyping() {
    const area = document.getElementById('messagesArea');
    const div  = document.createElement('div');
    div.className = 'typing-indicator'; div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="msg-avatar">🧠</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  function clearChat() {
    chatHistory = [];
    const area = document.getElementById('messagesArea');
    area.innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <div class="ce-icon">💬</div>
        <h3>Chat cleared</h3>
        <p>Ask a new question about your document.</p>
      </div>
    `;
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function onActivate() { populateDocSelect(); }

  return { render, onActivate };
})();