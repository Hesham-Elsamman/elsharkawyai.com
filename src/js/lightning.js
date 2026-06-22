class LightningBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'lightning-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0'; // Behind content
        this.canvas.style.pointerEvents = 'none'; // So it doesn't block clicks
        
        // Add canvas to container (prepended so it's behind)
        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);

        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            console.warn('WebGL not supported');
            return;
        }

        this.mousePos = { x: 0.5, y: 0.5 };
        this.init();
    }

    init() {
        const gl = this.gl;

        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform float time;
            uniform vec2 resolution;
            uniform vec2 mouse;
            uniform vec3 u_lightningColor;
            uniform vec3 u_smokeColor;

            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                    dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                float aspect = resolution.x / resolution.y;
                vec2 uvAspect = vec2(uv.x * aspect, uv.y);
                
                float t = time * 0.8;
                
                // Smoke Background
                float smokeNoise = snoise(uvAspect * 1.5 + vec2(t * 0.1, t * 0.05)) * 0.5 + 0.5;
                smokeNoise += snoise(uvAspect * 3.0 - vec2(t * 0.05, t * 0.1)) * 0.25;
                
                // Base background color mapping to theme
                vec3 smokeColor = u_smokeColor * smokeNoise;
                
                // Lightning Effect
                float n1 = snoise(uvAspect * 2.0 + vec2(t * 0.4, t * 0.2));
                float n2 = snoise(uvAspect * 4.0 - vec2(t * 0.2, t * 0.6));
                float lightningNoise = n1 * 0.7 + n2 * 0.3;
                
                float mouseDist = length(uv - mouse);
                float interaction = smoothstep(0.5, 0.0, mouseDist);
                
                float mainLine = abs(uv.x - 0.5 - lightningNoise * 0.2 - (mouse.x - 0.5) * interaction);
                float mainGlow = 0.012 / (mainLine + 0.002);
                
                float branchNoise = snoise(uvAspect * 10.0 + t * 1.5);
                float branch = abs(uv.x - 0.5 - lightningNoise * 0.25 + branchNoise * 0.08);
                float branchGlow = 0.004 / (branch + 0.006);
                
                float flicker = snoise(vec2(t * 12.0, 0.0)) * 0.4 + 0.6;
                float finalGlow = (mainGlow + branchGlow * 0.6) * flicker;
                
                // Custom color based on theme
                vec3 lightningColor = u_lightningColor;
                
                vec3 finalColor = smokeColor + lightningColor * finalGlow;
                
                float vignette = 1.0 - length(uv - 0.5) * 1.2;
                finalColor = mix(u_smokeColor, finalColor, clamp(vignette, 0.0, 1.0));
                
                // Output color with slight alpha for layer blending if needed
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1,
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        this.timeLocation = gl.getUniformLocation(program, 'time');
        this.resolutionLocation = gl.getUniformLocation(program, 'resolution');
        this.mouseLocation = gl.getUniformLocation(program, 'mouse');
        this.lightningColorLocation = gl.getUniformLocation(program, 'u_lightningColor');
        this.smokeColorLocation = gl.getUniformLocation(program, 'u_smokeColor');

        this.themeColors = {
            'claude': { light: [203/255, 100/255, 65/255], bg: [251/255, 248/255, 241/255] },
            'shadcn': { light: [39/255, 39/255, 42/255], bg: [244/255, 244/255, 245/255] },
            'corporate': { light: [59/255, 130/255, 246/255], bg: [253/255, 253/255, 254/255] },
            'vscode': { light: [39/255, 172/255, 244/255], bg: [14/255, 17/255, 27/255] },
            'spotify': { light: [0/255, 189/255, 103/255], bg: [18/255, 21/255, 29/255] },
            'black': { light: [245/255, 245/255, 247/255], bg: [29/255, 29/255, 32/255] }
        };

        this.observer = new MutationObserver(() => this.updateColorsFromTheme());
        this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        this.updateColorsFromTheme();

        window.addEventListener('resize', this.resize.bind(this));
        
        // Track mouse globally for smooth interaction
        window.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            // Check if mouse is within hero container, if not, let it center slowly
            this.mousePos.x = (e.clientX - rect.left) / rect.width;
            this.mousePos.y = 1.0 - ((e.clientY - rect.top) / rect.height);
            this.mousePos.x = Math.max(0, Math.min(1, this.mousePos.x));
            this.mousePos.y = Math.max(0, Math.min(1, this.mousePos.y));
        });

        this.resize();
        this.render(0);
    }

    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    updateColorsFromTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'vscode';
        const colors = this.themeColors[theme] || this.themeColors['vscode'];
        this.lightningRGB = colors.light;
        this.smokeRGB = colors.bg;
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        // Use device pixel ratio for sharper rendering
        const dpr = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(now) {
        const time = now * 0.001;
        
        this.gl.uniform1f(this.timeLocation, time);
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.mouseLocation, this.mousePos.x, this.mousePos.y);

        if (this.lightningRGB && this.smokeRGB) {
            this.gl.uniform3f(this.lightningColorLocation, this.lightningRGB[0], this.lightningRGB[1], this.lightningRGB[2]);
            this.gl.uniform3f(this.smokeColorLocation, this.smokeRGB[0], this.smokeRGB[1], this.smokeRGB[2]);
        }
        
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        requestAnimationFrame(this.render.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the lightning background exclusively on the hero section
    if (document.getElementById('home')) {
        new LightningBackground('home');
    }
});
