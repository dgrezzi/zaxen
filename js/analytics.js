(function () {
  const host = window.location.hostname;

  // Ambientes de desenvolvimento
  const isDev =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.github.io');

  // Não executa em desenvolvimento
  if (isDev) return;

  // Injeta Umami em produção
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', 'e28a930e-2c0a-4665-b527-0bd660700381');

  document.head.appendChild(script);
})();
