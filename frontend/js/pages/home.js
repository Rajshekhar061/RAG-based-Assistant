const HomePage = (() => {
  function render() {
    document.getElementById('page-home').innerHTML = `
      <div class="hero">
        <div class="hero-eyebrow">✦ RAG-Powered AI</div>
        <h1>Ask Your Documents<br/>Anything</h1>
        <p>Upload PDFs and get instant AI-powered answers grounded in your actual content — not hallucinations.</p>
        <div class="hero-btns">
          <button class="btn btn-primary" id="heroUploadBtn">📄 Upload PDF</button>
          <button class="btn btn-secondary" id="heroChatBtn">💬 Start Chatting</button>
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="fc-icon" style="background:var(--accent-glow)">🔍</div>
          <h3>Semantic Search</h3>
          <p>Sentence embeddings find the most relevant passages — beyond simple keyword matching.</p>
        </div>
        <div class="feature-card">
          <div class="fc-icon" style="background:var(--green-bg)">⚡</div>
          <h3>Instant Answers</h3>
          <p>Groq-powered LLM delivers fast, context-grounded responses in seconds.</p>
        </div>
        <div class="feature-card">
          <div class="fc-icon" style="background:var(--amber-bg)">🗄️</div>
          <h3>FAISS Vector Store</h3>
          <p>Documents are chunked, embedded, and indexed locally for blazing-fast retrieval.</p>
        </div>
        <div class="feature-card">
          <div class="fc-icon" style="background:var(--red-bg)">📚</div>
          <h3>Multi-Document</h3>
          <p>Upload multiple PDFs and switch between them — each gets its own document ID.</p>
        </div>
      </div>

      <div class="hiw">
        <h2>How it works</h2>
        <div class="steps">
          ${[
            ['Upload a PDF',        'Your document is parsed and split into overlapping chunks.'],
            ['Generate Embeddings', 'Each chunk is converted to a dense vector using sentence-transformers.'],
            ['Store in FAISS',      'Vectors are indexed in FAISS and persisted to disk.'],
            ['Ask Questions',       'Your query is embedded, top-k chunks retrieved, and Groq LLM answers from context only.'],
          ].map(([title, desc], i) => `
            <div class="step">
              <div class="step-num">${i+1}</div>
              <div class="step-connector"></div>
              <div class="step-body">
                <h4>${title}</h4>
                <p>${desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('heroUploadBtn').addEventListener('click', () => Router.go('upload'));
    document.getElementById('heroChatBtn').addEventListener('click', () => Router.go('chat'));
  }

  return { render };
})();