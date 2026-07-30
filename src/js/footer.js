/* src/js/footer.js */

class Footer {
    constructor() {
        this.footerElement = document.getElementById('main-footer');
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.sharks = [];
        this.rafId = null;
        if (this.footerElement) {
            this.init();
        }
    }

    init() {
        this.render();
        this.createParticles();
        this.createSharks();
        this.bindMouseEvents();

        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.lang;
            this.render();
            this.createParticles();
            this.createSharks();
            this.bindMouseEvents();
        });
    }

    render() {
        const isAr = this.currentLang === 'ar';
        const textPrefix = isAr ? 'تم التصميم والبرمجة بواسطة' : 'Designed &amp; Built by';

        const footerHtml = `
            <div class="premium-footer" id="premium-footer-inner" dir="${isAr ? 'rtl' : 'ltr'}">
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
     * SPECIES 1: Sleek Mako Shark (Fast, streamlined, aerodynamic)
     */
    _buildMakoSharkSVG(glowColor, uid) {
        const gId = `g-mako-${uid}`;
        const fId = `f-mako-${uid}`;
        const lId = `l-mako-${uid}`;
        const bId = `b-mako-${uid}`;

        return `
        <svg class="shark-svg mako-shark" viewBox="0 0 340 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated Mako Shark" overflow="visible">
            <defs>
                <linearGradient id="${gId}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.05"/>
                    <stop offset="40%" stop-color="${glowColor}" stop-opacity="0.25"/>
                    <stop offset="75%" stop-color="${glowColor}" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.12"/>
                </linearGradient>
                <linearGradient id="${bId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.32"/>
                    <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.05"/>
                </linearGradient>
                <filter id="${fId}" x="-20%" y="-40%" width="140%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="${lId}" x="-30%" y="-60%" width="160%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            <!-- TAIL -->
            <g class="shark-tail-group">
                <path d="M52,56 C42,50 18,28 2,8 C14,20 36,40 50,52 Z" fill="${glowColor}" fill-opacity="0.75" stroke="${glowColor}" stroke-width="0.8" filter="url(#${lId})"/>
                <path d="M52,64 C44,68 24,86 8,100 C20,90 40,72 50,66 Z" fill="${glowColor}" fill-opacity="0.6" stroke="${glowColor}" stroke-width="0.7" filter="url(#${lId})"/>
                <path d="M48,52 C50,55 51,58 50,64 C52,60 53,56 51,52 Z" fill="${glowColor}" fill-opacity="0.5"/>
            </g>

            <!-- BODY -->
            <g class="shark-body-group">
                <path d="M58,60 C70,60 90,68 120,67 C155,66 185,70 220,68 C255,65 285,62 310,60 C325,58 336,57 340,57 C336,57 325,56 310,54 C285,52 255,50 220,47 C185,44 155,46 120,47 C90,48 70,54 58,54 C55,54 54,56 55,57 C54,58 55,60 58,60 Z" fill="url(#${gId})" stroke="${glowColor}" stroke-width="1.1" filter="url(#${fId})"/>
                <path d="M70,60 C95,62 130,65 165,64 C200,63 240,61 285,59 C270,59 240,59 200,61 C165,62 130,63 95,61 C82,61 74,60 70,60 Z" fill="url(#${bId})" opacity="0.5"/>
                
                <!-- Fins -->
                <path d="M175,48 C180,40 188,20 196,8 C200,14 202,26 203,36 C202,40 198,46 192,48 Z" fill="${glowColor}" fill-opacity="0.7" stroke="${glowColor}" stroke-width="1" filter="url(#${lId})"/>
                <path d="M155,60 C148,64 132,82 122,95 C134,86 148,70 158,64 C162,62 162,60 158,60 Z" fill="${glowColor}" fill-opacity="0.5" stroke="${glowColor}" stroke-width="0.8" filter="url(#${lId})"/>
                <path d="M232,52 C235,46 240,40 244,38 C245,42 244,48 241,52 Z" fill="${glowColor}" fill-opacity="0.5" stroke="${glowColor}" stroke-width="0.7"/>
                <path d="M246,60 C242,66 236,76 232,82 C237,75 244,66 250,62 Z" fill="${glowColor}" fill-opacity="0.4" stroke="${glowColor}" stroke-width="0.6"/>
                
                <!-- Snout & Gills -->
                <path d="M310,54 C322,54 332,55 338,57 C332,59 322,60 310,60 C315,59 318,58 315,57 C318,56 315,55 310,54 Z" fill="${glowColor}" fill-opacity="0.8" stroke="${glowColor}" stroke-width="0.9" filter="url(#${lId})"/>
                <path d="M287,50 Q285,57 287,64 M280,51 Q278,57 280,63 M273,52 Q271,57 273,62" fill="none" stroke="${glowColor}" stroke-width="0.9" stroke-opacity="0.5" stroke-linecap="round"/>
                <path d="M75,57 Q180,54 295,57" fill="none" stroke="${glowColor}" stroke-width="0.45" stroke-opacity="0.22" stroke-dasharray="4,6"/>
                
                <!-- Eye -->
                <circle cx="322" cy="56" r="3.8" fill="none" stroke="${glowColor}" stroke-width="0.8" filter="url(#${lId})"/>
                <circle cx="322" cy="56" r="2.8" fill="#060e1c" stroke="${glowColor}" stroke-width="0.6"/>
                <circle cx="323.2" cy="54.8" r="0.9" fill="${glowColor}" fill-opacity="0.95"/>
            </g>
        </svg>`;
    }

    /**
     * SPECIES 2: Great White Shark (Muscular, broad body, sharp jaw outline, distinct tall fin)
     */
    _buildGreatWhiteSharkSVG(glowColor, uid) {
        const gId = `g-gw-${uid}`;
        const fId = `f-gw-${uid}`;
        const lId = `l-gw-${uid}`;
        const bId = `b-gw-${uid}`;

        return `
        <svg class="shark-svg great-white-shark" viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated Great White Shark" overflow="visible">
            <defs>
                <linearGradient id="${gId}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.08"/>
                    <stop offset="35%" stop-color="${glowColor}" stop-opacity="0.32"/>
                    <stop offset="70%" stop-color="${glowColor}" stop-opacity="0.42"/>
                    <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.15"/>
                </linearGradient>
                <linearGradient id="${bId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="${glowColor}" stop-opacity="0.08"/>
                </linearGradient>
                <filter id="${fId}" x="-20%" y="-40%" width="140%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="${lId}" x="-30%" y="-60%" width="160%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            <!-- TAIL (Massive crescent tail fin) -->
            <g class="shark-tail-group">
                <path d="M50,62 C38,52 14,24 0,0 C12,18 36,44 48,58 Z" fill="${glowColor}" fill-opacity="0.82" stroke="${glowColor}" stroke-width="1" filter="url(#${lId})"/>
                <path d="M50,70 C40,78 18,102 2,120 C16,104 38,82 48,74 Z" fill="${glowColor}" fill-opacity="0.70" stroke="${glowColor}" stroke-width="0.9" filter="url(#${lId})"/>
                <!-- Keel ridge -->
                <path d="M42,65 Q52,66 60,65" stroke="${glowColor}" stroke-width="1.5" stroke-opacity="0.7" fill="none"/>
            </g>

            <!-- BODY -->
            <g class="shark-body-group">
                <!-- Massive deep torso -->
                <path d="M56,66 C68,66 90,78 125,78 C165,78 200,80 235,74 C270,68 300,64 322,60 C334,58 340,56 340,56 C336,54 322,51 300,48 C270,44 235,42 190,42 C150,42 120,44 90,48 C70,52 56,58 56,66 Z" fill="url(#${gId})" stroke="${glowColor}" stroke-width="1.3" filter="url(#${fId})"/>
                
                <!-- Underbelly countershading line -->
                <path d="M80,68 C110,74 150,76 195,74 C240,70 280,64 315,59 C280,61 240,63 195,64 C150,64 110,63 80,62 Z" fill="url(#${bId})" opacity="0.65"/>

                <!-- Giant Dorsal Fin -->
                <path d="M165,42 C172,28 182,5 192,0 C196,10 198,28 198,42 Z" fill="${glowColor}" fill-opacity="0.78" stroke="${glowColor}" stroke-width="1.2" filter="url(#${lId})"/>
                
                <!-- Heavy Pectoral Wing -->
                <path d="M150,70 C140,78 120,102 108,118 C122,106 142,86 156,74 Z" fill="${glowColor}" fill-opacity="0.6" stroke="${glowColor}" stroke-width="1" filter="url(#${lId})"/>
                
                <!-- Second dorsal & anal fin -->
                <path d="M240,48 C244,40 248,34 252,32 C253,38 251,44 248,48 Z" fill="${glowColor}" fill-opacity="0.5" stroke="${glowColor}" stroke-width="0.8"/>
                <path d="M255,70 C250,78 245,86 240,92 C246,84 252,75 258,70 Z" fill="${glowColor}" fill-opacity="0.45" stroke="${glowColor}" stroke-width="0.7"/>

                <!-- Snout & Jaw serrations -->
                <path d="M305,58 L325,58 L338,56 L325,54 L305,54 Z" fill="${glowColor}" fill-opacity="0.85" filter="url(#${lId})"/>
                <!-- Aggressive mouth line & teeth hint -->
                <path d="M302,62 Q315,64 326,59" fill="none" stroke="#00f2fe" stroke-width="1.2" stroke-opacity="0.8"/>
                <path d="M308,62 L310,60 M314,63 L316,61 M320,62 L322,60" stroke="#00f2fe" stroke-width="0.8" fill="none"/>

                <!-- 5 Gill Slits -->
                <path d="M285,46 Q282,58 285,70 M278,47 Q275,58 278,69 M271,48 Q268,58 271,68 M264,49 Q261,58 264,67 M257,50 Q254,58 257,66" fill="none" stroke="${glowColor}" stroke-width="1" stroke-opacity="0.6" stroke-linecap="round"/>

                <!-- Fierce Eye -->
                <circle cx="320" cy="53" r="4.2" fill="none" stroke="#00f2fe" stroke-width="1" filter="url(#${lId})"/>
                <circle cx="320" cy="53" r="3" fill="#040914" stroke="${glowColor}" stroke-width="0.8"/>
                <circle cx="321.2" cy="51.8" r="1" fill="#00f2fe" fill-opacity="0.95"/>
            </g>
        </svg>`;
    }

    createSharks() {
        const container = document.getElementById('footer-sharks-container');
        if (!container) return;
        container.innerHTML = '';
        this.sharks = [];

        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primary').trim() || '#27acf4';

        // 4 Sharks with 2 distinct species & multi-depth speeds
        const sharkConfigs = [
            // 1. Sleek Mako (Large, deep, slow LTR)
            {
                type: 'mako',
                widthPx: 210,
                topPct: 15,
                durationS: 24,
                delayS: -5,
                direction: 'ltr',
                opacity: 0.65,
                baseTailSpeed: 0.55,
                baseBodySpeed: 1.1,
                sineSpeed: '4s',
                glow: primaryColor,
                dropGlow: `drop-shadow(0 0 8px ${primaryColor}88)`
            },
            // 2. Great White (Aggressive medium, fast RTL)
            {
                type: 'great_white',
                widthPx: 175,
                topPct: 52,
                durationS: 16,
                delayS: -2,
                direction: 'rtl',
                opacity: 0.55,
                baseTailSpeed: 0.4,
                baseBodySpeed: 0.8,
                sineSpeed: '2.8s',
                glow: primaryColor,
                dropGlow: `drop-shadow(0 0 10px #00f2fe88)`
            },
            // 3. Sleek Mako (Small, fast LTR near bottom)
            {
                type: 'mako',
                widthPx: 95,
                topPct: 72,
                durationS: 12,
                delayS: -8,
                direction: 'ltr',
                opacity: 0.4,
                baseTailSpeed: 0.3,
                baseBodySpeed: 0.6,
                sineSpeed: '2.2s',
                glow: primaryColor,
                dropGlow: `drop-shadow(0 0 5px ${primaryColor}55)`
            },
            // 4. Great White (Hunter patrol, medium RTL near top)
            {
                type: 'great_white',
                widthPx: 135,
                topPct: 10,
                durationS: 20,
                delayS: -12,
                direction: 'rtl',
                opacity: 0.5,
                baseTailSpeed: 0.45,
                baseBodySpeed: 0.9,
                sineSpeed: '3.2s',
                glow: primaryColor,
                dropGlow: `drop-shadow(0 0 7px #00f2fe66)`
            }
        ];

        sharkConfigs.forEach((cfg, idx) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('animated-shark', `swim-${cfg.direction}`);
            wrapper.id = `footer-shark-${idx}`;

            wrapper.style.width = `${cfg.widthPx}px`;
            wrapper.style.top = `${cfg.topPct}%`;
            wrapper.style.opacity = cfg.opacity;
            wrapper.style.filter = cfg.dropGlow;
            wrapper.style.animationDuration = `${cfg.durationS}s`;
            wrapper.style.animationDelay = `${cfg.delayS}s`;

            // Evasion wrapper for smooth vector displacement (fleeing away from mouse)
            const evasion = document.createElement('div');
            evasion.classList.add('shark-evasion');

            // Inner wrapper handles sine wave vertical floating
            const inner = document.createElement('div');
            inner.classList.add('shark-inner');
            inner.style.animationDuration = cfg.sineSpeed;
            inner.style.setProperty('--tail-speed', `${cfg.baseTailSpeed}s`);
            inner.style.setProperty('--body-speed', `${cfg.baseBodySpeed}s`);

            // Pick SVG markup based on species type
            if (cfg.type === 'great_white') {
                inner.innerHTML = this._buildGreatWhiteSharkSVG(cfg.glow, idx);
            } else {
                inner.innerHTML = this._buildMakoSharkSVG(cfg.glow, idx);
            }

            evasion.appendChild(inner);
            wrapper.appendChild(evasion);
            container.appendChild(wrapper);

            // Store metadata for mouse interaction tracking
            this.sharks.push({
                element: wrapper,
                evasion: evasion,
                inner: inner,
                config: cfg
            });
        });
    }

    /**
     * Interactive Mouse Tracking:
     * - Vector repulsion math: calculates vector FROM mouse TO shark center.
     * - Displaces .shark-evasion container away smoothly using CSS transition.
     * - Accelerates tail wiggle & tilts shark nose in flee direction.
     * - Updates backdrop lighting spotlight position (--mouse-x, --mouse-y).
     */
    bindMouseEvents() {
        const footer = this.footerElement.querySelector('.premium-footer');
        if (!footer) return;

        let mouseX = -1000;
        let mouseY = -1000;
        let isHovering = false;

        const updateInteractions = () => {
            if (!isHovering) {
                this.sharks.forEach(s => {
                    s.inner.style.setProperty('--tail-speed', `${s.config.baseTailSpeed}s`);
                    s.inner.style.setProperty('--body-speed', `${s.config.baseBodySpeed}s`);
                    s.evasion.style.transform = 'translate(0px, 0px) rotate(0deg)';
                    s.element.classList.remove('scared');
                });
                return;
            }

            this.sharks.forEach(s => {
                const rect = s.element.getBoundingClientRect();
                const sharkX = rect.left + rect.width / 2;
                const sharkY = rect.top + rect.height / 2;

                const dx = sharkX - mouseX; // Vector pointing away from mouse
                const dy = sharkY - mouseY; // Vector pointing away from mouse
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxRadius = 240;

                if (dist < maxRadius && dist > 1) {
                    const intensity = 1 - (dist / maxRadius); // 0 to 1
                    const dirX = dx / dist;
                    const dirY = dy / dist;

                    // Push distance away from cursor (up to 55px vector evasion)
                    const pushDist = intensity * 55;
                    const pushX = dirX * pushDist;
                    const pushY = dirY * pushDist;

                    // Natural fleeing tilt angle
                    const tiltAngle = (dirY > 0 ? 1 : -1) * Math.min(18, Math.abs(dirY) * intensity * 22);

                    s.evasion.style.transform = `translate(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px) rotate(${tiltAngle.toFixed(1)}deg)`;

                    // Accelerated tail wiggle during flee
                    const fastTail = Math.max(0.12, s.config.baseTailSpeed * (1 - intensity * 0.7));
                    s.inner.style.setProperty('--tail-speed', `${fastTail}s`);
                    s.inner.style.setProperty('--body-speed', `${fastTail * 2}s`);
                    s.element.classList.add('scared');
                } else {
                    s.evasion.style.transform = 'translate(0px, 0px) rotate(0deg)';
                    s.inner.style.setProperty('--tail-speed', `${s.config.baseTailSpeed}s`);
                    s.inner.style.setProperty('--body-speed', `${s.config.baseBodySpeed}s`);
                    s.element.classList.remove('scared');
                }
            });
        };

        footer.addEventListener('mousemove', (e) => {
            isHovering = true;
            const rect = footer.getBoundingClientRect();
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Set CSS spotlight vars relative to footer
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            footer.style.setProperty('--mouse-x', `${relativeX}px`);
            footer.style.setProperty('--mouse-y', `${relativeY}px`);

            updateInteractions();
        });

        footer.addEventListener('mouseleave', () => {
            isHovering = false;
            updateInteractions();
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
