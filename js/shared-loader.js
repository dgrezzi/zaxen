// shared-loader.js - SIMPLIFICADO para páginas estáticas

document.addEventListener('DOMContentLoaded', function() {
  // Carrega os ícones primeiro
  loadIcons();
  
  // Depois carrega os dados
  loadSharedData();
});

function loadIcons() {
  // Verifica se os ícones já foram carregados
  if (!window.IconHelper) {
    // Se não, carrega o arquivo de ícones
    const script = document.createElement('script');
    script.src = '../js/icons.js';
    script.onload = loadSharedData;
    document.head.appendChild(script);
  }
}

function loadSharedData() {
  fetch("../data/company.json")
    .then(response => {
      if (!response.ok) throw new Error("Falha ao carregar dados");
      return response.json();
    })
    .then(data => {
      if (data.sharedData && data.sharedData.contact) {
        updateContactInfo(data.sharedData.contact);
      }
      if (data.footer) {
        updateFooterInfo(data);
      }
    })
    .catch(error => {
      console.log("Usando informações padrão");
    });
}

function updateContactInfo(contact) {
  // Substitui informações de contato em toda a página
  document.body.innerHTML = document.body.innerHTML
    .replace(/contato@zaxen\.com/g, contact.email)
    .replace(/@zaxen\.com/g, contact.email)
    .replace(/\+55 \(11\) 99999-9999/g, contact.phone)
    .replace(/São Paulo, Brasil/g, contact.address);
}

function updateFooterInfo(data) {
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Atualiza copyright
  const copyright = footer.querySelector('.copyright') || document.createElement('p');
  if (data.footer.copyright) {
    copyright.textContent = data.footer.copyright;
    copyright.className = 'copyright mt-4 text-slate-400 text-sm';
    if (!footer.contains(copyright)) {
      footer.appendChild(copyright);
    }
  }
  
  // Adiciona redes sociais se disponível
  if (data.sharedData && data.sharedData.social && window.IconHelper) {
    const socialContainer = document.createElement('div');
    socialContainer.className = 'social-links mt-6 flex justify-center gap-4';
    
    const socialHTML = Object.entries(data.sharedData.social).map(([platform, url]) => 
      `<a href="${url}" target="_blank" rel="noopener noreferrer" 
         class="text-slate-400 hover:text-blue-400 transition">
        <span class="sr-only">${platform}</span>
        ${window.IconHelper.getSocialIcon(platform)}
      </a>`
    ).join('');
    
    socialContainer.innerHTML = socialHTML;
    
    // Remove social container anterior se existir
    const oldSocial = footer.querySelector('.social-links');
    if (oldSocial) oldSocial.remove();
    
    footer.insertBefore(socialContainer, copyright);
  }
}