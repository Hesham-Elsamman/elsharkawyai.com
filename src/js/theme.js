(function () {
  var DARK_THEMES = [
    { id: 'vscode', label: 'VS Code', c1: '#27acf4', c2: '#0e111b' },
    { id: 'spotify', label: 'Spotify', c1: '#00bd67', c2: '#12151d' },
    { id: 'black', label: 'Black', c1: '#ffffff', c2: '#1d1d20' }
  ];
  var DEFAULT_THEME = 'vscode';

  // Apply saved theme immediately — no flicker
  var savedTheme = localStorage.getItem('site-theme') || DEFAULT_THEME;
  // Ensure the saved theme is still valid (in our 3-theme list)
  if (!DARK_THEMES.some(t => t.id === savedTheme)) {
      savedTheme = DEFAULT_THEME;
  }
  document.documentElement.setAttribute('data-theme', savedTheme);

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    buildPicker();
  });

  function injectStyles() {
    var s = document.createElement('style');
    s.id = 'tp-styles';
    s.textContent =
      '#theme-panel{position:fixed;top:56px;left:12px;z-index:9999;' +
      'background:oklch(var(--b2));border:1px solid oklch(var(--p)/.3);' +
      'border-radius:14px;padding:14px 16px;width:220px;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.35);' +
      'opacity:0;transform:translateY(-8px) scale(.97);' +
      'pointer-events:none;transition:opacity .2s,transform .2s;}' +
      '#theme-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}' +
      '.tp-heading{font-size:10px;font-weight:700;letter-spacing:.1em;' +
      'text-transform:uppercase;color:oklch(var(--p));margin-bottom:6px;opacity:.8;}' +
      '.tp-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}' +
      '.tp-item{display:flex;align-items:center;padding:7px 10px;border-radius:8px;' +
      'cursor:pointer;border:1.5px solid transparent;transition:all .15s;' +
      'font-size:12px;font-weight:500;color:oklch(var(--bc));background:oklch(var(--b3)/.5);}' +
      '.tp-swatch{width:16px;height:16px;border-radius:50%;margin-right:8px;border:1px solid rgba(128,128,128,.3);flex-shrink:0;box-shadow:inset 0 1px 2px rgba(0,0,0,.2);}' +
      '.tp-item:hover{background:oklch(var(--p)/.12);border-color:oklch(var(--p)/.4);}' +
      '.tp-item.active{border-color:oklch(var(--p));background:oklch(var(--p)/.15);font-weight:700;}' +
      '.tp-divider{height:1px;background:oklch(var(--p)/.15);margin:8px 0;}';
    document.head.appendChild(s);
  }

  function buildPicker() {
    var container = document.querySelector('.fixed.top-5.left-5');
    if (!container) return;

    // Palette button
    var btn = document.createElement('button');
    btn.id = 'theme-picker-btn';
    btn.className = 'btn btn-circle btn-sm btn-ghost border border-primary text-primary hover:bg-primary hover:text-base-100 transition-colors';
    btn.title = 'Change Theme';
    btn.textContent = '🎨';
    container.appendChild(btn);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.innerHTML = buildPanelHTML();
    document.body.appendChild(panel);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      highlightActive();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('open');
      }
    });

    panel.addEventListener('click', function (e) {
      var item = e.target.closest('.tp-item');
      if (!item) return;
      applyTheme(item.dataset.theme);
      panel.classList.remove('open');
    });
  }

  function buildPanelHTML() {
    function mk(arr) {
      return arr.map(function (t) {
        var gradient = 'linear-gradient(135deg, ' + t.c1 + ' 50%, ' + t.c2 + ' 50%)';
        return '<div class="tp-item" data-theme="' + t.id + '">' +
               '<div class="tp-swatch" style="background:' + gradient + ';"></div>' +
               '<span>' + t.label + '</span></div>';
      }).join('');
    }
    return (
      '<div class="tp-heading">🌙 Dark Themes</div>' +
      '<div class="tp-grid">' + mk(DARK_THEMES) + '</div>'
    );
  }

  function highlightActive() {
    var cur = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    document.querySelectorAll('.tp-item').forEach(function (el) {
      el.classList.toggle('active', el.dataset.theme === cur);
    });
  }

  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('site-theme', id);
    highlightActive();
    // Dispatch event so other components know (like navbar)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: id } }));
  }

  // Expose to global window
  window.applyTheme = applyTheme;
})();
