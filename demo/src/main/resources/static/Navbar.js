function setupNavigation() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            showNotification(`Switched to ${link.textContent.trim()}`, 'info');
            // Let the link navigate naturally
        });
    });
}
function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme();
  });
  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .stat-card, .team-member {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
        }
    `;
    document.head.appendChild(style);
});