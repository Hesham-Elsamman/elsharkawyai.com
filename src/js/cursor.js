document.addEventListener('DOMContentLoaded', () => {
    // Only display on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.id = 'cursor-dot';
    cursorOutline.id = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Inject refined styles
    const style = document.createElement('style');
    style.innerHTML = `
        * { cursor: none !important; } /* High-priority hide default cursor */
        
        #cursor-dot, #cursor-outline {
            position: fixed;
            top: 0; left: 0;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            z-index: 999999; /* Max z-index */
            pointer-events: none;
            transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease;
        }

        #cursor-dot {
            width: 8px;
            height: 8px;
            background-color: var(--color-primary, #27acf4);
            box-shadow: 0 0 10px var(--color-primary);
        }

        #cursor-outline {
            width: 34px;
            height: 34px;
            border: 1.5px solid var(--color-primary, #27acf4);
            opacity: 0.6;
            mix-blend-mode: exclusion; /* Creative blend mode */
        }

        /* Speed stretch effect */
        .cursor-moving #cursor-outline {
            opacity: 0.4;
        }

        /* Hover states */
        .cursor-hover #cursor-outline {
            width: 50px;
            height: 50px;
            background-color: var(--color-primary);
            border-color: transparent;
            opacity: 0.2;
        }

        .cursor-hover #cursor-dot {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
        }

        /* Clicking state */
        .cursor-active #cursor-outline {
            transform: translate(-50%, -50%) scale(0.7);
            background-color: var(--color-primary);
            opacity: 0.5;
        }

        /* Special hover for videos/media */
        .cursor-media #cursor-outline {
            width: 70px;
            height: 70px;
            background-color: var(--color-primary);
            border-color: transparent;
            opacity: 0.8;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .cursor-media #cursor-outline::after {
            content: "";
            width: 22px;
            height: 22px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-left: 4px; /* centers the visual weight of the triangle */
            mix-blend-mode: normal;
        }

        /* Hide when mouse leaves window */
        .cursor-hidden #cursor-dot,
        .cursor-hidden #cursor-outline {
            opacity: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // Track mouse movement
    let dotX = window.innerWidth / 2, dotY = window.innerHeight / 2;
    let outlineX = dotX, outlineY = dotY;
    let isMoving = false;
    let moveTimer;

    // Start with the cursor hidden until the user moves the mouse
    document.body.classList.add('cursor-hidden');

    window.addEventListener('mousemove', (e) => {
        document.body.classList.remove('cursor-hidden');
        dotX = e.clientX;
        dotY = e.clientY;
        
        // Instant update for dot
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        // Movement detection for speed effect
        isMoving = true;
        document.body.classList.add('cursor-moving');
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => {
            isMoving = false;
            document.body.classList.remove('cursor-moving');
        }, 100);
    });

    // Handle Clicks
    window.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

    // Handle Window Leave/Enter
    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

    // Animate outline for smooth trailing effect
    const animateOutline = () => {
        // LERP for smooth follow (0.08 for more lag)
        outlineX += (dotX - outlineX) * 0.08;
        outlineY += (dotY - outlineY) * 0.08;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    };
    animateOutline();

    // Universal Hover Observer
    const refreshInteractives = () => {
        const interactives = document.querySelectorAll('a, button, .interactive, input, .nav-link-item, .theme-orb, .control-btn, [role="button"]');
        interactives.forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";
            
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        const medias = document.querySelectorAll('.video-card, .vid-card, .img-card, .media-card');
        medias.forEach(el => {
            if (el.dataset.cursorMediaBound) return;
            el.dataset.cursorMediaBound = "true";

            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-media'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-media'));
        });
    };

    // Initial run and watch for DOM changes
    refreshInteractives();
    const observer = new MutationObserver(refreshInteractives);
    observer.observe(document.body, { childList: true, subtree: true });
});
