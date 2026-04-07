const Router = (() => {
  const pages = ['home', 'upload', 'chat', 'docs'];

  function go(id) {
    pages.forEach(p => {
      document.getElementById(`page-${p}`).classList.toggle('active', p === id);
    });
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === id);
    });

    // Notify pages on activation
    if (id === 'upload') UploadPage.onActivate();
    if (id === 'chat')   ChatPage.onActivate();
    if (id === 'docs')   DocsPage.onActivate();
  }

  function init() {
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', () => go(btn.dataset.page));
    });
  }

  return { go, init };
})();

// ── Toast ──────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}