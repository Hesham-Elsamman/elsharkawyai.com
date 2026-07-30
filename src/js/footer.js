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
        this.createSharks();

        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.render();
            this.createParticles();
            this.createSharks();
        });
    }

    render() {
        const isAr = this.currentLang === 'ar';
        const textPrefix = isAr ? 'تم التصميم والبرمجة بواسطة' : 'Designed &amp; Built by';

        const footerHtml = `
            <div class="premium-footer" dir="${isAr ? 'rtl' : 'ltr'}">
                <!-- Sharks Background Layer -->
                <div class="footer-sharks-container" id="footer-sharks-container"></div>
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

    /**
     * Builds the inline SVG markup for a single shark.
     * The tail group has class "shark-tail-group" so CSS can animate it.
     * Primary color is pulled from the CSS custom property --color-primary (fallback #27acf4).
     */
    _buildSharkSVG(glowColor) {
        return `
        <svg class="shark-svg" viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated swimming shark">
            <defs>
                <radialGradient id="sharkBodyGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.05"/>
                </radialGradient>
                <filter id="sharkGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>

            <!-- Tail group — animated by CSS .shark-tail-group -->
            <g class="shark-tail-group">
                <!-- Upper tail lobe -->
                <path d="M25,42 L0,10 L22,38 Z"
                      fill="${glowColor}" fill-opacity="0.75"
                      stroke="${glowColor}" stroke-width="0.6" stroke-opacity="0.5"/>
                <!-- Lower tail lobe -->
                <path d="M25,48 L0,78 L22,52 Z"
                      fill="${glowColor}" fill-opacity="0.6"
                      stroke="${glowColor}" stroke-width="0.6" stroke-opacity="0.5"/>
            </g>

            <!-- Body group — subtle counter-wiggle -->
            <g class="shark-body-group">
                <!-- Main torpedo body -->
                <ellipse cx="125" cy="45" rx="82" ry="22"
                         fill="${glowColor}" fill-opacity="0.18"
                         stroke="${glowColor}" stroke-width="1" stroke-opacity="0.55"
                         filter="url(#sharkGlow)"/>

                <!-- Body highlight ridge -->
                <path d="M60,30 Q125,22 195,38"
                      fill="none" stroke="${glowColor}" stroke-width="0.8" stroke-opacity="0.35"/>

                <!-- Dorsal fin -->
                <path d="M110,24 L130,6 L148,24 Z"
                      fill="${glowColor}" fill-opacity="0.65"
                      stroke="${glowColor}" stroke-width="0.8" stroke-opacity="0.5"/>

                <!-- Pectoral fin (left/lower) -->
                <path d="M105,52 L88,72 L125,56 Z"
                      fill="${glowColor}" fill-opacity="0.45"
                      stroke="${glowColor}" stroke-width="0.6" stroke-opacity="0.35"/>

                <!-- Pelvic fin -->
                <path d="M148,52 L140,66 L162,55 Z"
                      fill="${glowColor}" fill-opacity="0.4"
                      stroke="${glowColor}" stroke-width="0.5" stroke-opacity="0.3"/>

                <!-- Anal fin -->
                <path d="M158,56 L153,70 L170,58 Z"
                      fill="${glowColor}" fill-opacity="0.35"
                      stroke="${glowColor}" stroke-width="0.5" stroke-opacity="0.3"/>

                <!-- Snout point -->
                <path d="M190,40 Q215,44 210,47 Q215,50 190,50 Q200,45 190,40 Z"
                      fill="${glowColor}" fill-opacity="0.7"
                      stroke="${glowColor}" stroke-width="0.7" stroke-opacity="0.6"/>

                <!-- Eye -->
                <circle cx="197" cy="43" r="2.2"
                        fill="#0a1628" stroke="${glowColor}" stroke-width="0.8" stroke-opacity="0.9"/>
                <circle cx="197.7" cy="42.4" r="0.7" fill="${glowColor}" fill-opacity="0.9"/>

                <!-- Gill slits -->
                <path d="M175,34 Q173,44 175,54" fill="none"
                      stroke="${glowColor}" stroke-width="0.7" stroke-opacity="0.5" stroke-linecap="round"/>
                <path d="M170,35 Q168,44 170,53" fill="none"
                      stroke="${glowColor}" stroke-width="0.7" stroke-opacity="0.4" stroke-linecap="round"/>
                <path d="M165,36 Q163,44 165,52" fill="none"
                      stroke="${glowColor}" stroke-width="0.6" stroke-opacity="0.3" stroke-linecap="round"/>
            </g>
        </svg>`;
    }

    createSharks() {
        const container = document.getElementById('footer-sharks-container');
        if (!container) return;
        container.innerHTML = '';

        // Get primary color from CSS custom property or fall back
        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primary').trim() || '#27acf4';

        // Shark configuration: each entry defines depth/size/speed/position
        const sharkConfigs = [
            // Large, slow deep shark — swims left to right
            {
                widthPx:  200,
                topPct:   18,
                durationS: 22,
                delayS:   -5,
                direction: 'ltr',
                opacity:  0.55,
                tailSpeed: '0.55s',
                bodySpeed: '1.1s',
                sineSpeed: '3.8s',
                glow:     primaryColor,
                dropGlow: `drop-shadow(0 0 7px ${primaryColor}88)`,
            },
            // Medium, fast shark — swims right to left
            {
                widthPx:  130,
                topPct:   55,
                durationS: 15,
                delayS:   -2,
                direction: 'rtl',
                opacity:  0.45,
                tailSpeed: '0.38s',
                bodySpeed: '0.76s',
                sineSpeed: '2.6s',
                glow:     primaryColor,
                dropGlow: `drop-shadow(0 0 5px ${primaryColor}77)`,
            },
            // Small, very fast shark — swims left to right, near bottom
            {
                widthPx:  85,
                topPct:   68,
                durationS: 10,
                delayS:   -7,
                direction: 'ltr',
                opacity:  0.35,
                tailSpeed: '0.28s',
                bodySpeed: '0.56s',
                sineSpeed: '2s',
                glow:     primaryColor,
                dropGlow: `drop-shadow(0 0 4px ${primaryColor}55)`,
            },
        ];

        sharkConfigs.forEach((cfg, idx) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('animated-shark', `swim-${cfg.direction}`);
            wrapper.id = `footer-shark-${idx}`;

            // Position & size
            wrapper.style.width       = `${cfg.widthPx}px`;
            wrapper.style.top         = `${cfg.topPct}%`;
            wrapper.style.opacity     = cfg.opacity;
            wrapper.style.filter      = cfg.dropGlow;

            // Swim animation timing
            wrapper.style.animationDuration = `${cfg.durationS}s`;
            wrapper.style.animationDelay    = `${cfg.delayS}s`;

            // Inner wrapper handles the sine-wave vertical drift
            const inner = document.createElement('div');
            inner.classList.add('shark-inner');
            inner.style.animationDuration = cfg.sineSpeed;

            // Pass tail/body wiggle speeds as CSS custom props on the element
            inner.style.setProperty('--tail-speed', cfg.tailSpeed);
            inner.style.setProperty('--body-speed', cfg.bodySpeed);
            inner.innerHTML = this._buildSharkSVG(cfg.glow);

            wrapper.appendChild(inner);
            container.appendChild(wrapper);
        });
    }

    createParticles() {
        const container = document.getElementById('footer-particles-container');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.classList.add('footer-particle');

            const size     = Math.random() * 5 + 2;
            const left     = Math.random() * 100;
            const duration = Math.random() * 4 + 2;
            const delay    = Math.random() * 4;

            particle.style.width           = `${size}px`;
            particle.style.height          = `${size}px`;
            particle.style.left            = `${left}%`;
            particle.style.bottom          = `-${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay   = `${delay}s`;

            container.appendChild(particle);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.siteFooter = new Footer();
});
