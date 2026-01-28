// No início do app.js, adicione a referência ao icons.js
// (O icons.js deve ser carregado ANTES do app.js no HTML)

// Configuração do fetch com tratamento de erro
async function loadSiteData() {
  try {
    const response = await fetch("data/company.json");
    if (!response.ok) throw new Error("Falha ao carregar dados");
    const data = await response.json();
    
    // Popula toda a página
    populatePage(data);
    
    // Inicializa funcionalidades
    initMenu();
    initSmoothScroll();
    initActiveNav();
    
  } catch (error) {
    console.error("Erro ao carregar dados do site:", error);
    showErrorState();
  }
}

// Função principal para popular a página
function populatePage(data) {
  // NOME DO SITE
  if (data.site) {
    document.title = `${data.site.name} - ${data.site.tagline}`;
    const navBrand = document.querySelector('nav .text-2xl.font-bold');
    if (navBrand) navBrand.textContent = data.site.name;
  }

  // HERO (seguro para páginas que não possuem hero)
  const hero = data.hero || null;
  const heroTitleEl = document.getElementById("hero-title");
  if (hero && heroTitleEl && hero.title) {
    heroTitleEl.innerHTML = hero.title.replace(" ", "<br>");
  }
  const heroSubtitleEl = document.getElementById("hero-subtitle");
  if (hero && heroSubtitleEl && hero.subtitle) heroSubtitleEl.textContent = hero.subtitle;
  const heroCtaEl = document.getElementById("hero-cta");
  if (hero && heroCtaEl && hero.cta) heroCtaEl.textContent = hero.cta;
  const heroSection = document.getElementById("home");
  if (heroSection && hero && hero.backgroundImage) {
    heroSection.style.backgroundImage = `url('${hero.backgroundImage}')`;
  }

  // SOBRE (seguro caso a página não tenha seção sobre)
  const aboutTextEl = document.getElementById("about-text");
  if (aboutTextEl && data.about && data.about.text) {
    aboutTextEl.textContent = data.about.text;
  }
  
  // SERVIÇOS
  const servicesSection = document.getElementById("services");
  if (servicesSection && data.services) {
    const servicesContainer = servicesSection.querySelector('.grid');
    
    if (servicesContainer) {
      servicesContainer.innerHTML = data.services.items.map(service => `
        <div class="service-card bg-slate-900 p-8 rounded-lg border border-slate-700 hover:border-blue-600 transition">
          <div class="w-14 h-14 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6">
            ${IconHelper.getServiceIcon(service.icon)}
          </div>
          <h3 class="text-xl font-semibold mb-4">${service.title}</h3>
          <p class="text-slate-400">${service.description}</p>
        </div>
      `).join('');
    }
  }
  
  // INSIGHTS
  const insightsSection = document.getElementById("insights");
  if (insightsSection && data.insights) {
    const insightsContainer = insightsSection.querySelector('.grid');
    
    if (insightsContainer) {
      insightsContainer.innerHTML = data.insights.items.map(insight => `
        <div class="insight-card bg-slate-900 p-6 rounded-lg border border-slate-700">
          <span class="category text-blue-400 text-sm">${insight.category}</span>
          <h3 class="text-xl font-semibold mt-2 mb-3">${insight.title}</h3>
          <p class="text-slate-400 text-sm">${insight.summary}</p>
          ${insight.readTime ? `<span class="text-slate-500 text-xs mt-2 block">Tempo de leitura: ${insight.readTime}</span>` : ''}
        </div>
      `).join('');
    }
  }
  
  // DADOS COMPARTILHÁVEIS (CONTATO) — atualiza tanto a página principal quanto páginas legais
  if (data.sharedData) {
    if (data.sharedData.contact) {
      const contact = data.sharedData.contact;
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const contactInfo = document.createElement('div');
        contactInfo.className = 'text-center mt-8 space-y-4';
        contactInfo.innerHTML = `
          <div class="space-y-2">
            <p class="text-slate-300"><span class="font-medium">E-mail:</span> ${contact.email}</p>
            <p class="text-slate-300"><span class="font-medium">Telefone:</span> ${contact.phone}</p>
          </div>
          <div class="pt-4 border-t border-slate-800">
            <p class="text-slate-400 text-sm">${contact.address}</p>
            <p class="text-slate-400 text-sm mt-1">${contact.availability}</p>
          </div>
        `;
        const target = contactSection.querySelector('.max-w-2xl') || contactSection;
        target.appendChild(contactInfo);
      }

      // Se houver campos explícitos em páginas legais, atualiza
      const emailEl = document.getElementById('contact-email'); if (emailEl) emailEl.textContent = data.sharedData.contact.email || emailEl.textContent;
      const privacyEmailEl = document.getElementById('privacy-contact-email'); if (privacyEmailEl) privacyEmailEl.textContent = data.sharedData.contact.email || privacyEmailEl.textContent;
      const phoneEl = document.getElementById('contact-phone'); if (phoneEl) phoneEl.textContent = data.sharedData.contact.phone || phoneEl.textContent;
      const availabilityEl = document.getElementById('availability'); if (availabilityEl) availabilityEl.textContent = data.sharedData.contact.availability || availabilityEl.textContent;
    }

    if (data.sharedData.companyInfo) {
      const ci = data.sharedData.companyInfo;
      const nameEl = document.getElementById('company-name'); if (nameEl) nameEl.textContent = ci.name || nameEl.textContent;
      const cnpjEl = document.getElementById('company-cnpj'); if (cnpjEl) cnpjEl.textContent = ci.cnpj || cnpjEl.textContent;
      const addrEl = document.getElementById('company-address'); if (addrEl) addrEl.textContent = ci.address || addrEl.textContent;
    }
    // Document meta (última atualização / versão) — procura em sharedData.meta
    const meta = (data.sharedData && data.sharedData.meta) || data.meta || (data.footer && data.footer.meta);
    if (meta) {
      const lastEl = document.getElementById('doc-last-updated'); if (lastEl && meta.lastUpdated) lastEl.textContent = meta.lastUpdated;
      const verEl = document.getElementById('doc-version'); if (verEl && meta.version) verEl.textContent = meta.version;
    }
  }
  
  // RODAPÉ
  const footer = document.querySelector('footer');
  if (footer && data.footer) {
    const footerTextEl = document.getElementById("footer-text");
    if (footerTextEl) footerTextEl.textContent = data.footer.copyright || footerTextEl.textContent;
    const footerTaglineEl = document.getElementById("footer-tagline");
    if (footerTaglineEl) footerTaglineEl.textContent = data.footer.tagline || footerTaglineEl.textContent;

    // LINKS PARA PÁGINAS LEGAIS - FIXADO
    const legalLinksContainer = document.createElement('div');
    legalLinksContainer.className = 'mt-6 flex flex-wrap justify-center gap-4 md:gap-6';
    legalLinksContainer.innerHTML = `
      <a href="privacy.html" class="text-slate-400 hover:text-white text-sm transition">Política de Privacidade</a>
      <a href="terms.html" class="text-slate-400 hover:text-white text-sm transition">Termos de Serviço</a>
      <a href="legal.html" class="text-slate-400 hover:text-white text-sm transition">Aviso Legal</a>
    `;
    footer.appendChild(legalLinksContainer);

    // Adiciona redes sociais se existirem
    if (data.sharedData && data.sharedData.social && Array.isArray(data.sharedData.social)) {
      const socialContainer = document.createElement('div');
      socialContainer.className = 'mt-6 flex justify-center gap-4';
      socialContainer.innerHTML = data.sharedData.social
        .filter(social => social.active !== false) // Filtra os que têm active: false
        .map(social => 
          `<a href="${social.url}" target="_blank" rel="noopener noreferrer" 
             class="text-slate-400 hover:text-blue-400 transition transform hover:scale-110">
            <span class="sr-only">${social.platform}</span>
            ${IconHelper.getSocialIcon(social.platform)}
          </a>`
        ).join('');
      footer.appendChild(socialContainer);
    }
  }
}

// Função para menu mobile
function initMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

// Função para scroll suave E atualizar link ativo
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        
        // Atualiza link ativo
        setActiveNavLink(targetId);
        
        // Fecha menu mobile se aberto
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    });
  });
}

// Função para gerenciar navegação ativa
function initActiveNav() {
  // Define link inicial como ativo
  setActiveNavLink('#home');
  
  // Observa scroll para atualizar link ativo
  window.addEventListener('scroll', updateActiveNavOnScroll);
  
  // Atualiza link ativo quando a página carrega
  updateActiveNavOnScroll();
}

// Define o link ativo
function setActiveNavLink(targetId) {
  // Remove classe ativa de todos os links
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.classList.remove('text-blue-400');
    link.classList.add('text-slate-300');
  });
  
  // Adiciona classe ativa ao link clicado
  const activeLink = document.querySelector(`nav a[href="${targetId}"]`);
  if (activeLink) {
    activeLink.classList.remove('text-slate-300');
    activeLink.classList.add('text-blue-400');
  }
}

// Atualiza navegação ativa baseada no scroll
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = '#' + section.getAttribute('id');
    }
  });
  
  // Se encontrou uma seção ativa, atualiza o link
  if (currentSection) {
    setActiveNavLink(currentSection);
  }
}

// Estado de erro
function showErrorState() {
  const mainElements = document.querySelectorAll('#hero-title, #hero-subtitle, #about-text');
  mainElements.forEach(el => {
    if (el) el.textContent = "Falha ao carregar conteúdo. Por favor, atualize a página.";
  });
}


// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadSiteData);