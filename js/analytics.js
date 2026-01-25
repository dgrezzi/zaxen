(function () {
  const host = window.location.hostname;
  const protocol = window.location.protocol;

  // Ambientes locais
  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0';

  // Ambientes de preview (GitHub Pages, etc.)
  const isPreview =
    host.endsWith('.github.io');

  // Debug: log do ambiente detectado
  console.log('[Analytics] Host:', host, '| Local:', isLocal, '| Preview:', isPreview);

  // Não registra analytics fora de produção
  if (isLocal || isPreview) {
    console.log('[Analytics] Desativado em ambiente de desenvolvimento/preview');
    return;
  }

  // Evita injeção duplicada
  if (document.querySelector('script[data-website-id]')) {
    console.log('[Analytics] Script já injetado');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', 'e28a930e-2c0a-4665-b527-0bd660700381');
  script.setAttribute('data-auto-track', 'true');
  script.setAttribute('data-cache', 'false');

  // Log quando o script é adicionado
  script.onload = function() {
    console.log('[Analytics] Script Umami carregado com sucesso');
  };

  script.onerror = function() {
    console.error('[Analytics] Erro ao carregar script Umami');
  };

  console.log('[Analytics] Injetando script Umami...');
  document.head.appendChild(script);
})();
