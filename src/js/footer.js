/* src/js/footer.js */

class Footer {
    constructor() {
        this.footerElement = document.getElementById('main-footer');
        this.currentLang = localStorage.getItem('lang') || 'en';
        if (this.footerElement) {
            this.init();
        }
    }

    init() {
        this.render();
        this.createParticles();
        
        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.render();
            this.createParticles();
        });
    }

    render() {
        const isAr = this.currentLang === 'ar';
        
        const textPrefix = isAr ? 'تم التصميم والبرمجة بواسطة' : 'Designed & Built by';

        const footerHtml = `
            <div class="premium-footer" dir="${isAr ? 'rtl' : 'ltr'}">
                <div class="footer-content-wrapper">
                    <div class="footer-made-with">
                        ${textPrefix}
                        <a href="https://github.com/Hesham-Elsamman" target="_blank" class="dev-link">
                            <i class="fi fi-brands-github github-icon"></i>
                            <bdi dir="ltr">Hesham<span>.dev</span></bdi>
                        </a>
                    </div>
                </div>
                <!-- Particles Container -->
                <div id="footer-particles-container"></div>
            </div>
        `;

        this.footerElement.innerHTML = footerHtml;
    }

    createParticles() {
        const container = document.getElementById('footer-particles-container');
        if (!container) return;
        container.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('footer-particle');
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 3;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.bottom = `-${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.siteFooter = new Footer();
});
