const API_BASE = 'http://localhost:8000';

const API = {
  async healthCheck() {
    const r = await fetch(`${API_BASE}/`);
    if (!r.ok) throw new Error('offline');
    return r.json();
  },

  async uploadPDF(file, onProgress) {
    const form = new FormData();
    form.append('file', file);

    // Simulate progress since fetch doesn't expose upload progress easily
    let prog = 0;
    const timer = setInterval(() => {
      prog = Math.min(prog + 12, 85);
      onProgress && onProgress(prog);
    }, 250);

    try {
      const r = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
      clearInterval(timer);
      onProgress && onProgress(100);
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.detail || `Upload failed (${r.status})`);
      }
      return r.json();
    } catch (e) {
      clearInterval(timer);
      throw e;
    }
  },

  async chat(doc_id, question) {
    const r = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id, question }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed (${r.status})`);
    }
    return r.json();  // { answer, sources }
  },
};