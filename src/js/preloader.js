// --- Synchronous Execution (Prevents FOUC since script is in <head>) ---
if (document.head) {
    const foucStyle = document.createElement('style');
    foucStyle.id = 'fouc-block-style';
    foucStyle.innerHTML = `
        body { background-color: #0e111b !important; }
        body > *:not(#modern-preloader):not(script):not(style) {
            opacity: 0 !important; 
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(foucStyle);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Determine language & page
    const savedLang = localStorage.getItem('lang') || 'en';
    const isArabic = savedLang === 'ar';
    const pageAttr = document.body.dataset.page || 'index';
    
    // Inject Preloader HTML
    const preloader = document.createElement('div');
    preloader.id = 'modern-preloader';
    preloader.dir = isArabic ? 'rtl' : 'ltr';

    const style = document.createElement('style');

    if (pageAttr !== 'index') {
        // Other Pages: Signature Cursive
        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
        const displayName = capitalize(pageAttr); // e.g. "Skills"
        
        preloader.innerHTML = `
            <div class="pl-door pl-door-top"></div>
            <div class="pl-door pl-door-bottom"></div>
            <div class="pl-wrapper" id="pl-wrapper">
                <svg class="text-signature-svg" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="text-signature preloader-sig">${displayName}</text>
                </svg>
            </div>
        `;

        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            #modern-preloader { position: fixed; inset: 0; z-index: 999999; display: flex; justify-content: center; align-items: center; pointer-events: all; }
            .pl-door { position: absolute; left: 0; width: 100%; height: 50vh; background-color: var(--color-base-100, #0e111b); z-index: 1; }
            .pl-door-top { top: 0; }
            .pl-door-bottom { bottom: 0; }
            .pl-wrapper { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
            
            .text-signature-svg { width: 90vw; max-width: 600px; height: 200px; overflow: visible; filter: drop-shadow(0px 0px 8px var(--color-primary)); }
            .text-signature { font-family: 'Great Vibes', cursive; font-size: 7rem; fill: transparent; stroke: var(--color-primary); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 3000; stroke-dashoffset: 3000; }
        `;
    }
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Prevent scrolling during preloader
    document.body.style.overflow = 'hidden';

    // Function to reveal the page just before doors open
    const revealPage = () => {
        const blk = document.getElementById('fouc-block-style');
        if (blk) blk.remove();
    };

    // GSAP Timeline Sequence for Enter Animation
    const enterTl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = '';
            // Instead of display none, we use pointer-events none so doors can be animated back later
            preloader.style.pointerEvents = 'none';
            window.dispatchEvent(new CustomEvent('preloaderFinished'));
        }
    });

    if (pageAttr === 'index') {
        const brandName = isArabic ? 'أدهم الشرقاوي' : 'Adham Sharkawy';
        const sigFont   = isArabic ? '"Cairo", sans-serif' : "'Great Vibes', cursive";
        const sigSize   = isArabic ? '5rem' : '7rem';
        const sigDash   = isArabic ? '5000' : '3500';
        
        preloader.innerHTML = `
            <div class="pl-door pl-door-top"></div>
            <div class="pl-door pl-door-bottom"></div>
            <div class="pl-wrapper" id="pl-wrapper">
                <div class="pl-brand-container">
                    <svg class="pl-brand-sig-svg" viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg">
                        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" class="pl-brand-sig">${brandName}</text>
                    </svg>
                    <div class="pl-ai-label">AI</div>
                </div>
                <div class="pl-progress-container">
                    <svg class="pl-stroke-svg" viewBox="0 0 500 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path class="pl-stroke-path" d="M 2 15 C 30 8, 60 22, 90 15 C 120 8, 150 22, 180 15 C 210 8, 240 22, 270 15 C 300 8, 330 22, 360 15 C 390 8, 420 22, 450 15 C 470 10, 488 18, 498 15" />
                    </svg>
                </div>
            </div>
        `;
        
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            #modern-preloader { position: fixed; inset: 0; z-index: 999999; display: flex; justify-content: center; align-items: center; pointer-events: all; }
            .pl-door { position: absolute; left: 0; width: 100%; height: 50vh; background-color: var(--color-base-100, #0e111b); z-index: 1; }
            .pl-door-top { top: 0; }
            .pl-door-bottom { bottom: 0; }
            .pl-wrapper { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 800px; }
            .pl-brand-container { display: flex; flex-direction: column; align-items: center; gap: 0px; }
            .pl-brand-sig-svg { width: 90vw; max-width: 600px; height: 150px; overflow: visible; filter: drop-shadow(0 0 10px var(--color-primary)); }
            .pl-brand-sig { font-family: ${sigFont}; font-size: ${sigSize}; fill: transparent; stroke: var(--color-primary); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: ${sigDash}; stroke-dashoffset: ${sigDash}; }
            .pl-ai-label { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 900; letter-spacing: 8px; color: transparent; -webkit-text-stroke: 1px var(--color-primary); opacity: 0; margin-top: -8px; text-shadow: 0 0 15px var(--color-primary); }
            .pl-progress-container { width: 100%; max-width: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-top: 5px; opacity: 0; }
            .pl-stroke-svg { width: 100%; height: 30px; overflow: visible; filter: drop-shadow(0 0 6px var(--color-primary)) drop-shadow(0 0 14px var(--color-primary)); }
            .pl-stroke-path { fill: none; stroke: var(--color-primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 560; stroke-dashoffset: 560; }
            @media (max-width: 480px) {
                .pl-brand-sig { font-size: calc(${sigSize} * 0.7); }
                .pl-ai-label { font-size: 0.8rem; letter-spacing: 5px; }
                .pl-brand-sig-svg { height: 110px; }
            }
        `;

        enterTl
            // 1. Draw the name signature
            .to('.pl-brand-sig', { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" })
            // 2. Fill with primary color + show "AI" label
            .to('.pl-brand-sig', { fill: 'var(--color-primary)', duration: 0.5, ease: "power2.out" }, "-=0.2")
            .to('.pl-ai-label', { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3")
            // 3. Show wavy line and draw it
            .to('.pl-progress-container', { opacity: 1, duration: 0.3 }, "-=0.1")
            .to('.pl-stroke-path', { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut" }, "-=0.2")
            // 4. Glow the AI label at the end
            .to('.pl-ai-label', { color: 'var(--color-primary)', textShadow: '0 0 20px var(--color-primary)', duration: 0.4 }, "-=0.4")
            // 5. Hold & exit
            .to({}, { duration: 0.4 })
            .to('#pl-wrapper', { scale: 0.85, opacity: 0, duration: 0.6, ease: "power3.inOut" })
            .call(revealPage, null, "split-=0.1")
            .to('.pl-door-top', { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "split")
            .to('.pl-door-bottom', { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "split");
    } else {
        // Signature Animation for other pages
        enterTl.to('.preloader-sig', { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" })
               .to('.preloader-sig', { fill: "var(--color-primary)", duration: 0.5, ease: "power1.inOut" }, "-=0.5")
               .to({}, { duration: 0.4 })
               .to('#pl-wrapper', { scale: 0.9, opacity: 0, duration: 0.6, ease: "power3.inOut" })
               .call(revealPage, null, "split-=0.1")
               .to('.pl-door-top', { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "split")
               .to('.pl-door-bottom', { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "split");
    }

    // Intercept Links for Leave Animation
    // We bind it globally safely.
    document.body.addEventListener('click', (e) => {
        // Look up the DOM tree to find the nearest <a> element
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Check if it's an internal HTML link and not a hash link
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#') && href.endsWith('.html')) {
            e.preventDefault();
            
            // Block scrolling and clicks while animating out
            document.body.style.overflow = 'hidden';
            const pl = document.getElementById('modern-preloader');
            if (pl) pl.style.pointerEvents = 'all';

            // Animate doors closing
            const leaveTl = gsap.timeline({
                onComplete: () => {
                    // Navigate only after doors are fully closed
                    window.location.href = href;
                }
            });

            // Slam doors shut
            leaveTl.to('.pl-door-top', { yPercent: 0, duration: 0.8, ease: "power4.inOut" }, 0)
                   .to('.pl-door-bottom', { yPercent: 0, duration: 0.8, ease: "power4.inOut" }, 0);
        }
    });
});
