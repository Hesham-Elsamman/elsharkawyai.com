/**
 * ElectricBorder - Smart & Interactive Version
 * - Theme-aware (reads CSS variables).
 * - Hover interaction (switches to VOLTAGE on hover).
 */
class ElectricBorder {
    constructor(element, options = {}) {
        this.container = element;
        
        // Presets logic
        this.presets = {
            1: { speed: 1.5, chaos: 0.25 }, // VOLTAGE
            2: { speed: 0.8, chaos: 0.15 }, // SYSTEM
            3: { speed: 2.0, chaos: 0.30 }, // CRITICAL
            4: { speed: 0.5, chaos: 0.10 }  // SECURE
        };

        this.basePresetId = parseInt(element.getAttribute('data-eb-preset')) || 1;
        this.currentPresetId = this.basePresetId;
        
        this.rawColor = element.getAttribute('data-eb-color') || '--color-primary';
        this.resolvedColor = this.resolveColor(this.rawColor);
        
        this.options = {
            borderRadius: parseInt(element.getAttribute('data-eb-radius')) || 24,
            ...this.presets[this.currentPresetId],
            ...options
        };

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.lastFrameTime = 0;
        
        this.OCTAVES = 10;
        this.LACUNARITY = 1.6;
        this.GAIN = 0.7;
        this.FREQUENCY = 10;
        this.BASE_FLATNESS = 0;
        this.DISPLACEMENT = 60;
        this.BORDER_OFFSET = 60;

        this.init();
    }

    resolveColor(colorInput) {
        if (colorInput.startsWith('--')) {
            const val = getComputedStyle(document.documentElement).getPropertyValue(colorInput).trim();
            return val || '#5227FF'; // Fallback
        }
        return colorInput;
    }

    init() {
        this.container.classList.add('electric-border-ready');
        this.container.style.position = 'relative';

        const wrapper = document.createElement('div');
        wrapper.className = 'electric-border-canvas-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.inset = '0';
        wrapper.style.pointerEvents = 'none';
        wrapper.style.zIndex = '10'; 
        
        this.canvas.className = 'electric-border-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '50%';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        
        wrapper.appendChild(this.canvas);
        this.container.appendChild(wrapper);

        this.addGlows();
        
        this.draw = this.draw.bind(this);
        this.resize();
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);

        // Theme Change Observer
        this.themeObserver = new MutationObserver(() => {
            this.resolvedColor = this.resolveColor(this.rawColor);
            this.updateGlowColor();
        });
        this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Hover Listeners
        this.container.addEventListener('mouseenter', () => {
            this.currentPresetId = 1; // Switch to VOLTAGE
            this.updateFromPreset();
        });
        this.container.addEventListener('mouseleave', () => {
            this.currentPresetId = this.basePresetId; // Switch back
            this.updateFromPreset();
        });

        requestAnimationFrame(this.draw);
    }

    updateFromPreset() {
        const p = this.presets[this.currentPresetId];
        this.options.speed = p.speed;
        this.options.chaos = p.chaos;
    }

    addGlows() {
        this.glowElement = document.createElement('div');
        this.glowElement.className = 'electric-border-glows';
        this.glowElement.style.position = 'absolute';
        this.glowElement.style.inset = '0';
        this.glowElement.style.borderRadius = 'inherit';
        this.glowElement.style.pointerEvents = 'none';
        this.glowElement.style.border = `2px solid ${this.resolvedColor}`;
        this.glowElement.style.filter = 'blur(4px)';
        this.glowElement.style.opacity = '0.5';
        this.glowElement.style.zIndex = '0';
        this.container.appendChild(this.glowElement);
    }

    updateGlowColor() {
        if (this.glowElement) {
            this.glowElement.style.borderColor = this.resolvedColor;
        }
    }

    random(x) {
        return (Math.sin(x * 12.9898) * 43758.5453) % 1;
    }

    noise2D(x, y) {
        const i = Math.floor(x), j = Math.floor(y);
        const fx = x - i, fy = y - j;
        const a = this.random(i + j * 57), b = this.random(i + 1 + j * 57);
        const c = this.random(i + (j + 1) * 57), d = this.random(i + 1 + (j + 1) * 57);
        const ux = fx * fx * (3.0 - 2.0 * fx), uy = fy * fy * (3.0 - 2.0 * fy);
        return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    }

    octavedNoise(x, time, seed) {
        let y = 0, amp = this.options.chaos, freq = this.FREQUENCY;
        for (let i = 0; i < this.OCTAVES; i++) {
            let octaveAmp = amp;
            if (i === 0) octaveAmp *= this.BASE_FLATNESS;
            y += octaveAmp * this.noise2D(freq * x + seed * 100, time * freq * 0.3);
            freq *= this.LACUNARITY;
            amp *= this.GAIN;
        }
        return y;
    }

    getRoundedRectPoint(t, left, top, width, height, radius) {
        const sw = width - 2 * radius, sh = height - 2 * radius, arc = (Math.PI * radius) / 2;
        const total = 2 * sw + 2 * sh + 4 * arc, distance = t * total;
        let acc = 0;
        if (distance <= (acc += sw)) return { x: left + radius + (distance / sw) * sw, y: top };
        if (distance <= (acc += arc)) return this.getArc(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - (acc - arc)) / arc);
        if (distance <= (acc += sh)) return { x: left + width, y: top + radius + ((distance - (acc - sh)) / sh) * sh };
        if (distance <= (acc += arc)) return this.getArc(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - (acc - arc)) / arc);
        if (distance <= (acc += sw)) return { x: left + width - radius - ((distance - (acc - sw)) / sw) * sw, y: top + height };
        if (distance <= (acc += arc)) return this.getArc(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - (acc - arc)) / arc);
        if (distance <= (acc += sh)) return { x: left, y: top + height - radius - ((distance - (acc - sh)) / sh) * sh };
        const progress = (distance - acc) / arc;
        return this.getArc(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
    }

    getArc(cx, cy, r, sa, al, p) {
        const a = sa + p * al;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width + this.BORDER_OFFSET * 2;
        this.height = rect.height + this.BORDER_OFFSET * 2;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    draw(now) {
        const dt = (now - this.lastFrameTime) / 1000;
        if (this.lastFrameTime !== 0) this.time += dt * this.options.speed;
        this.lastFrameTime = now;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.strokeStyle = this.resolvedColor;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const w = this.width - 2 * this.BORDER_OFFSET, h = this.height - 2 * this.BORDER_OFFSET;
        const radius = Math.min(this.options.borderRadius, Math.min(w, h) / 2);
        const samples = Math.floor((2 * (w + h) + 2 * Math.PI * radius) / 2);

        ctx.beginPath();
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const p = this.getRoundedRectPoint(t, this.BORDER_OFFSET, this.BORDER_OFFSET, w, h, radius);
            
            const dx = p.x + this.octavedNoise(t * 8, this.time, 0) * this.DISPLACEMENT;
            const dy = p.y + this.octavedNoise(t * 8, this.time, 1) * this.DISPLACEMENT;
            
            if (i === 0) ctx.moveTo(dx, dy); else ctx.lineTo(dx, dy);
        }
        ctx.stroke();
        requestAnimationFrame(this.draw);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-electric-border]').forEach(el => new ElectricBorder(el));
});
