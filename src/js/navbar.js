/* ==========================================================================
   Modular Navbar Component - Premium Version
   ========================================================================== */

const DARK_THEMES = [
    { 
        id: 'vscode', 
        name: 'VS Code', 
        nameAr: 'فيجوال ستوديو', 
        primary: '#27acf4', 
        bg: '#0e111b',
        logo: 'src/assets/imgs/logo-blue.png',
        desc: 'Pro Navy & Cyan' 
    },
    { 
        id: 'spotify', 
        name: 'Spotify', 
        nameAr: 'سبوتيفاي', 
        primary: '#00bd67', 
        bg: '#12151d',
        logo: 'src/assets/imgs/logo-green.png',
        desc: 'Sleek Green & Black' 
    },
    { 
        id: 'black', 
        name: 'Deep Black', 
        nameAr: 'أسود داكن', 
        primary: '#f5f5f7', 
        bg: '#1d1d20',
        logo: 'src/assets/imgs/logo-white.png',
        desc: 'Pure Minimalist' 
    }
];

class Navbar {
    constructor() {
        this.navElement = document.getElementById('main-navbar');
        this.isScrolled = false;
        this.lastScroll = 0;
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.init();
    }

    init() {
        this.render();
        this.attachListeners();
        this.handleScroll();
        this.updateActiveLink();
        
        // Listen for external sync
        window.addEventListener('themeChanged', (e) => this.syncThemeUI(e.detail.theme));
        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.render();
            this.attachListeners();
            this.updateActiveLink(); // Re-apply active state after re-render
        });
    }

    render() {
        const isAr = this.currentLang === 'ar';
        const currentTheme = localStorage.getItem('site-theme') || 'vscode';

        const navHtml = `
            <nav class="navbar-container glass">
                <div class="navbar-content" dir="${isAr ? 'rtl' : 'ltr'}">
                    <!-- Premium Logo Section -->
                    <div class="nav-logo">
                        <a href="/" class="logo-link">
                            <img src="${DARK_THEMES.find(t => t.id === currentTheme)?.logo || 'src/assets/imgs/logo-blue.png'}" alt="Sharkawy AI" class="logo-img">
                            <span class="logo-text">SHARKAWY <span class="highlight">AI</span></span>
                        </a>
                    </div>

                    <!-- Desktop Navigation Links -->
                    <ul class="nav-links nav-desktop-only">
                        <li><a href="/" class="nav-link-item" data-page="index">${isAr ? 'الرئيسية' : 'Home'}</a></li>
                        <li><a href="works.html" class="nav-link-item" data-page="works">${isAr ? 'أعمالي' : 'Works'}</a></li>
                        <!-- <li><a href="skills.html" class="nav-link-item" data-page="skills">${isAr ? 'مهاراتي' : 'Skills'}</a></li> -->
                        <li><a href="contact.html" class="nav-link-item" data-page="contact">${isAr ? 'تواصل معي' : 'Contact'}</a></li>
                    </ul>

                    <!-- Controls Section -->
                    <div class="nav-controls">
                        <!-- Theme Toggle (Innovative Orbs) -->
                        <div class="dropdown theme-orb-container">
                            <button class="control-btn" id="themeBtn" title="${isAr ? 'تغيير الثيم' : 'Change Theme'}">
                                <i class="fi fi-rr-palette"></i>
                            </button>
                            <div class="theme-orb-rail glass" id="themeMenu">
                                ${DARK_THEMES.map(t => `
                                    <div class="theme-orb ${currentTheme === t.id ? 'active' : ''}" 
                                         data-theme-id="${t.id}" 
                                         title="${isAr ? t.nameAr : t.name}"
                                         style="--orb-primary: ${t.primary}; --orb-bg: ${t.bg}">
                                        <div class="orb-inner"></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Language Toggle -->
                        <button class="control-btn lang-btn" id="langToggle">
                            ${isAr ? 'EN' : 'عربي'}
                        </button>

                        <!-- WhatsApp Desktop -->
                        <a href="https://wa.me/201014163012" target="_blank" class="whatsapp-btn-nav nav-desktop-only">
                            <i class="fi fi-brands-whatsapp"></i>
                        </a>

                        <!-- Mobile Menu Hamburger -->
                        <button class="control-btn nav-mobile-only" id="mobileMenuBtn">
                            <i class="fi fi-rr-menu-burger"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile Navigation Overlay -->
            <div class="mobile-menu-overlay" id="mobileOverlay">
                <div class="mobile-menu-panel">
                    <button class="close-mobile-menu" id="closeMobileMenu">&times;</button>
                    <ul class="mobile-links">
                        <li><a href="/" class="nav-link-item" data-page="index">${isAr ? 'الرئيسية' : 'Home'}</a></li>
                        <li><a href="works.html" class="nav-link-item" data-page="works">${isAr ? 'أعمالي' : 'Works'}</a></li>
                        <li><a href="skills.html" class="nav-link-item" data-page="skills">${isAr ? 'مهاراتي' : 'Skills'}</a></li>
                        <li><a href="contact.html" class="nav-link-item" data-page="contact">${isAr ? 'تواصل معي' : 'Contact'}</a></li>
                    </ul>
                    <div style="margin-top: 40px; display: flex; justify-content: center;">
                         <a href="https://wa.me/201014163012" target="_blank" class="whatsapp-btn-nav">
                            <i class="fi fi-brands-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.navElement.innerHTML = navHtml;
    }

    attachListeners() {
        const themeBtn = document.getElementById('themeBtn');
        const themeMenu = document.getElementById('themeMenu');

        // Toggle theme menu on click
        themeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('show');
        });

        // Close menu on outside click
        document.addEventListener('click', () => {
            themeMenu?.classList.remove('show');
        });

        // Theme selection (Orbs)
        document.querySelectorAll('.theme-orb').forEach(orb => {
            orb.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeId = orb.getAttribute('data-theme-id');
                if (window.applyTheme) {
                    window.applyTheme(themeId);
                } else {
                    document.documentElement.setAttribute('data-theme', themeId);
                    localStorage.setItem('site-theme', themeId);
                }
                themeMenu.classList.remove('show');
                this.syncThemeUI(themeId);
            });
        });

        // Language toggle
        document.getElementById('langToggle')?.addEventListener('click', () => {
            const newLang = this.currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('lang', newLang);
            window.location.reload();
        });

        // Mobile Menu
        const overlay = document.getElementById('mobileOverlay');
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => overlay.classList.add('active'));
        document.getElementById('closeMobileMenu')?.addEventListener('click', () => overlay.classList.remove('active'));

        document.querySelectorAll('.mobile-links .nav-link-item').forEach(link => {
            link.addEventListener('click', () => overlay.classList.remove('active'));
        });
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const container = document.querySelector('.navbar-container');

            if (currentScroll > 50) {
                container?.classList.add('scrolled');
                this.isScrolled = true;
            } else {
                container?.classList.remove('scrolled');
                this.isScrolled = false;
            }

            if (currentScroll > this.lastScroll && currentScroll > 200) {
                this.navElement.style.transform = 'translateY(-100%)';
            } else {
                this.navElement.style.transform = 'translateY(0)';
            }
            this.lastScroll = currentScroll;
        });
    }

    updateActiveLink() {
        // Robust detection of current page
        const path = window.location.pathname;
        const page = path.split("/").pop().split(".")[0] || 'index';
        
        console.log("Current Page Detected:", page);

        document.querySelectorAll('.nav-link-item').forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    syncThemeUI(themeId) {
        document.querySelectorAll('.theme-orb').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-theme-id') === themeId);
        });

        // Update logo image dynamically
        const logoImg = document.querySelector('.nav-logo .logo-img');
        const theme = DARK_THEMES.find(t => t.id === themeId);
        if (logoImg && theme) {
            logoImg.src = theme.logo;
        }
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.siteNavbar = new Navbar();
});
