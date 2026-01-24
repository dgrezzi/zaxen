(function () {
  const host = window.location.hostname;

  // Ambientes locais
  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0';

  // Ambientes de preview (GitHub Pages, etc.)
  const isPreview =
    host.endsWith('.github.io');

  // Não registra analytics fora de produção
  if (isLocal || isPreview) return;

  // Evita injeção duplicada
  if (document.querySelector('script[data-website-id]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute(
    'data-website-id',
    'e28a930e-2c0a-4665-b527-0bd660700381'
  );

  document.head.appendChild(script);
})();
