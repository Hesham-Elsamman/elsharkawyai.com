document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Global performance config
        gsap.config({ 
            force3D: true, 
            nullTargetWarn: false,
            units: { left: "px", top: "px", rotation: "deg" }
        });

        const heroTitle = document.querySelector('.hero-title');
        
        const startIfReady = () => {
            if (heroTitle && heroTitle.textContent.trim() !== '' && window.preloaderDone) {
                initHomeAnimations();
            }
        };

        window.addEventListener('preloaderFinished', () => {
            window.preloaderDone = true;
            startIfReady();
        });

        window.addEventListener('languageChanged', () => {
            startIfReady();
            if (window.heroAnimStarted && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    }
});

function initHomeAnimations() {
    const heroSection = document.querySelector('#home');
    const aboutSection = document.querySelector('#about');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // Safety check: if heroTitle is still empty, wait for languageChanged
    if (!heroTitle || heroTitle.textContent.trim() === '') return;
    
    // If already initialized for THIS text, don't redo animations but refresh
    if (window.heroAnimStarted && (heroTitle.querySelector('.char') || heroTitle.classList.contains('title-full-hover'))) return;
    window.heroAnimStarted = true;

    // Clean up old timeline if it exists
    if (window.heroTlInstance) {
        window.heroTlInstance.kill();
    }

    const isArabic = document.documentElement.getAttribute('lang') === 'ar';

    // Split text for English title
    if (!isArabic && heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        
        // Add JS-based hover interactions to prevent CSS transition fighting
        document.querySelectorAll('.char').forEach(char => {
            if (char.innerHTML === '&nbsp;') return; // Skip spaces
            
            char.addEventListener('mouseenter', () => {
                gsap.to(char, { 
                    y: -15, 
                    scale: 1.2, 
                    color: "var(--color-primary)", 
                    textShadow: "0 0 10px var(--color-primary), 0 0 30px var(--color-primary), 0 0 50px var(--color-primary)",
                    duration: 0.3,
                    ease: "back.out(2)" // Adds a nice spring effect
                });
            });
            char.addEventListener('mouseleave', () => {
                gsap.to(char, { 
                    y: 0, 
                    scale: 1, 
                    color: "#ffffff", 
                    textShadow: "0 0 10px rgba(39, 172, 244, 0.3), 0 0 20px rgba(39, 172, 244, 0.1)", // Original shadow
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

    } else if (isArabic && heroTitle) {
        heroTitle.classList.add('title-full-hover');
    }

    // --- GSAP Pinning ---
    if (heroSection && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: heroSection,
            pin: true,
            start: "top top",
            end: "bottom top", 
            pinSpacing: false,
            id: "hero-pin"
        });
    }

    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    window.heroTlInstance = heroTl; // Store to kill later if needed

    // Immediately show the parent container if it was hidden by CSS
    if (heroTitle) {
        heroTl.set(heroTitle, { autoAlpha: 1 });
    }

    if (!isArabic && heroTitle) {
        // Use fromTo to ensure no relative scattered positions get locked in
        heroTl.fromTo(".char", {
            y: 100,
            autoAlpha: 0,
            skewY: 10,
            filter: "blur(10px)"
        }, {
            y: 0,
            autoAlpha: 1,
            skewY: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.05
        });
    } else {
        heroTl.fromTo(".hero-title", {
            y: 50,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 1.5
        });
    }

    gsap.set(".hero-cta-group", { autoAlpha: 0, y: 25 });

    heroTl.fromTo(".hero-subtitle", {
        autoAlpha: 0,
        y: 30,
        filter: "blur(5px)"
    }, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.5,
    }, "-=0.3");

    heroTl.to(".hero-cta-group", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        clearProps: "transform"
    }, "-=0.6");

    // --- Scroll Reveal Animations ---
    
    // Default Reveal
    gsap.utils.toArray(".gsap-reveal").forEach((el) => {
        gsap.fromTo(el, {
            y: 30, // Reduced from 50 for smoother entry
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 1, // Slightly faster for better feeling
            overwrite: "auto",
            lazy: true,
            scrollTrigger: {
                trigger: el,
                start: "top 90%", // Trigger slightly later
                toggleActions: "play none none reverse"
            }
        });
    });

    // --- Optimized Batch Reveal for Services (Accordion Timeline) ---
    const serviceItems = document.querySelectorAll(".gsap-reveal-service");
    if (serviceItems.length > 0) {
        gsap.fromTo(serviceItems, {
            y: 40,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".services-list",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        // --- Accordion Toggle Logic ---
        serviceItems.forEach(item => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others
                serviceItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- Optimized Side Reveals (About Section) ---
    const revealLeft = document.querySelectorAll(".gsap-reveal-left");
    if (revealLeft.length > 0) {
        gsap.fromTo(revealLeft, { x: -50, autoAlpha: 0 }, {
            x: 0, autoAlpha: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: "#about", start: "top 80%" }
        });
    }

    const revealRight = document.querySelectorAll(".gsap-reveal-right");
    if (revealRight.length > 0) {
        gsap.fromTo(revealRight, { x: 50, autoAlpha: 0 }, {
            x: 0, autoAlpha: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: "#about", start: "top 80%" }
        });
    }

    // --- About Description Word by Word Reveal (Both Languages) ---
    const aboutDescs = document.querySelectorAll('.about-desc');
    let allWords = [];

    aboutDescs.forEach(aboutDesc => {
        if (!aboutDesc.classList.contains('split-done')) {
            const words = aboutDesc.textContent.trim().split(/\s+/);
            // Replace the text with spanned words if we have actual text
            if (words.length > 0 && words[0] !== "") {
                aboutDesc.innerHTML = words.map(word => `<span class="word inline-block opacity-0 translate-y-4 filter blur-sm">${word}</span>`).join(' ');
                aboutDesc.classList.add('split-done');
            }
        }

        const wordElements = aboutDesc.querySelectorAll('.word');
        if (wordElements.length > 0) {
            allWords = allWords.concat(Array.from(wordElements));
        }
    });

    if (allWords.length > 0) {
        gsap.to(allWords, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6, // Faster reveal
            stagger: 0.02, // Lower stagger for better performance
            ease: "power2.out",
            overwrite: "auto",
            lazy: true,
            scrollTrigger: {
                trigger: aboutDescs[0],
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // --- Counter Animation ---
    gsap.utils.toArray(".counter").forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power1.inOut"
                });
            }
        });
    });

    // --- Marquee / Parallax CTA ---
    gsap.to(".marquee", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: "#cta",
            scrub: 1,
            start: "top bottom",
            end: "bottom top"
        }
    });

    // Scroll-bound title scale
    gsap.to(".hero-title-scroll", {
        scale: 1.1,
        scrollTrigger: {
            trigger: "#cta",
            scrub: true,
            start: "top center",
            end: "bottom center"
        }
    });

    // --- Lightning Background Interaction with Scroll ---
    // Make the lightning follow the scroll intensity
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        // You could adjust lightning params here if exposed
    });

    // --- About Signature Animation ---
    const aboutSig = document.querySelector('.about-signature-text');
    const aboutSigLink = document.querySelector('.about-sig-link');
    if (aboutSig && aboutSigLink) {
        const sigTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSigLink,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        sigTl
            // First: reveal the container from its final position (no y movement)
            .to(aboutSigLink, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
            // Then: draw the stroke
            .to(aboutSig, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
            .to(aboutSig, { fill: "var(--color-primary)", duration: 0.5 });
    }

    // --- Services Signature Animation ---
    const servicesSig = document.querySelector('.services-signature-text');
    const servicesSigSvg = document.querySelector('.gsap-reveal-signature');
    if (servicesSig && servicesSigSvg) {
        const sigTl = gsap.timeline({
            scrollTrigger: {
                trigger: servicesSigSvg,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        sigTl
            .to(servicesSig, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
            .to(servicesSig, { fill: "var(--color-primary)", duration: 0.5 }, "-=0.2");
    }
}
