// Bootstrap the app
(async function init() {
  // Render all pages
  HomePage.render();
  UploadPage.render();
  ChatPage.render();
  DocsPage.render();

  // Init router
  Router.init();

  // Health check
  async function checkHealth() {
    const dot  = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    try {
      await API.healthCheck();
      dot.className  = 'status-dot online';
      text.textContent = 'API online';
      Store.setApiOnline(true);
    } catch {
      dot.className  = 'status-dot offline';
      text.textContent = 'API offline';
      Store.setApiOnline(false);
    }
  }

  await checkHealth();
  setInterval(checkHealth, 15000);  // re-check every 15s
})();