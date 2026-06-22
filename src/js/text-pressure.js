class TextPressure {
    constructor(options = {}) {
        this.options = {
            radius: options.radius || 250,
            minWeight: options.minWeight || 100,
            maxWeight: options.maxWeight || 900,
            minWidth: options.minWidth || 50,
            maxWidth: options.maxWidth || 151,
            minSlant: options.minSlant || 0,
            maxSlant: options.maxSlant || -10,
            ...options
        };

        this.elements = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.isRunning = false;

        this.init();
        this.bindEvents();
    }

    init() {
        const targets = document.querySelectorAll('[data-text-pressure]');
        
        // Setup Intersection Observer to only animate what's visible
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const group = this.elements.find(g => g.container === entry.target);
                if (group) group.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0 });

        targets.forEach(target => {
            const text = target.textContent.trim();
            target.innerHTML = '';
            target.classList.add('text-pressure-container');

            const chars = text.split('').map(char => {
                const span = document.createElement('span');
                span.classList.add('text-pressure-char');
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                target.appendChild(span);
                return {
                    el: span,
                    x: 0,
                    y: 0,
                    lastSettings: ''
                };
            });

            const group = {
                container: target,
                chars: chars,
                isVisible: false,
                rect: null,
                isDirty: true
            };

            this.elements.push(group);
            this.observer.observe(target);
        });

        // Measure synchronously first
        this.measure();

        // And again after layout settles
        setTimeout(() => this.measure(), 150);
        
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    measure() {
        this.elements.forEach(group => {
            group.rect = group.container.getBoundingClientRect();
            // Update absolute positions for group center
            group.centerX = group.rect.left + group.rect.width / 2 + window.scrollX;
            group.centerY = group.rect.top + group.rect.height / 2 + window.scrollY;

            group.chars.forEach(char => {
                const r = char.el.getBoundingClientRect();
                char.x = r.left + r.width / 2 + window.scrollX;
                char.y = r.top + r.height / 2 + window.scrollY;
            });
        });
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.measure());
        });
        window.addEventListener('scroll', () => {
            // Usually scroll doesn't change relative position within document, 
            // but we'll measure just in case of fixed/sticky elements
            this.measure();
        }, { passive: true });
    }

    // Performance Optimized Loop
    animate() {
        if (!this.isRunning) return;

        this.elements.forEach(group => {
            if (!group.isVisible || !group.rect) return;

            // --- Optimization: Bounding Box Pre-check ---
            const distToGroup = Math.hypot(this.mouseX - group.centerX, this.mouseY - group.centerY);

            // If mouse is far from the whole sentence, reset characters once and skip
            if (distToGroup > this.options.radius + 300) {
                if (group.isDirty) {
                    this.resetGroup(group);
                    group.isDirty = false;
                }
                return;
            }

            group.isDirty = true;
            group.chars.forEach(char => {
                const dist = Math.hypot(this.mouseX - char.x, this.mouseY - char.y);
                const influence = Math.max(0, 1 - dist / this.options.radius);
                
                // Exponential easing
                const easedInfluence = influence * influence;

                const wght = Math.round(this.options.minWeight + (this.options.maxWeight - this.options.minWeight) * easedInfluence);
                const wdth = Math.round(this.options.minWidth + (this.options.maxWidth - this.options.minWidth) * easedInfluence);
                const slnt = Math.round((this.options.minSlant + (this.options.maxSlant - this.options.minSlant) * easedInfluence) * 10) / 10;

                const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}`;
                
                // --- Optimization: Dirty Check ---
                if (char.lastSettings !== settings) {
                    char.el.style.fontVariationSettings = settings;
                    // Optional: Remove Y translation for purely typographic interaction to save more CPU
                    // char.el.style.transform = `translateY(${-3 * easedInfluence}px)`;
                    char.lastSettings = settings;
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }

    resetGroup(group) {
        group.chars.forEach(char => {
            char.el.style.fontVariationSettings = `'wght' ${this.options.minWeight}, 'wdth' ${this.options.minWidth}, 'slnt' ${this.options.minSlant}`;
            char.el.style.transform = `none`;
            char.lastSettings = '';
        });
    }

    destroy() {
        this.isRunning = false;
        this.observer.disconnect();
        this.elements = [];
    }
}

// Auto-init with cleanup logic
document.addEventListener('DOMContentLoaded', () => {
    window.textPressure = new TextPressure();

    window.addEventListener('languageChanged', () => {
        setTimeout(() => {
            if (window.textPressure) {
                window.textPressure.destroy();
                window.textPressure = new TextPressure();
            }
        }, 100);
    });
});
