document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. Floating Logos Entry Animation
    const flotCards = document.querySelectorAll('.flot-card');
    if (flotCards.length > 0) {
        gsap.fromTo(flotCards, 
            { opacity: 0, scale: 0, rotation: -45 }, 
            {
                opacity: 1, scale: 1, rotation: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
                delay: 0.5
            }
        );
    }

    // 2. Continuous Floating Animation for Logos
    // (AOS originally used CSS duration, GSAP gives more random organic feel)
    flotCards.forEach((card, i) => {
        gsap.to(card, {
            y: "random(-15, 15)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: "random(2, 4)",
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.2
        });
    });

    // 3. Stats Counter & Flip Cards Entry
    const flipCards = document.querySelectorAll('.flip-card');
    if (flipCards.length > 0) {
        gsap.fromTo(flipCards,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#innerSection",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // Number Counter Animation for Radial Progress
    const radialBars = document.querySelectorAll('.radial-progress');
    radialBars.forEach(bar => {
        let finalValue = parseInt(bar.style.getPropertyValue('--value'));
        if (isNaN(finalValue)) return;
        
        let obj = { val: 0 };
        
        ScrollTrigger.create({
            trigger: bar,
            start: "top 85%",
            onEnter: () => {
                gsap.to(obj, {
                    val: finalValue,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        bar.style.setProperty('--value', Math.round(obj.val));
                    }
                });
            },
            once: true
        });
        
        // Ensure starting visually at 0
        bar.style.setProperty('--value', 0);
    });

    // 4. Testimonials Slider Reveal
    const commentsSection = document.querySelector('.clients-comments');
    if (commentsSection) {
        gsap.fromTo(commentsSection,
            { opacity: 0, scale: 0.95 },
            {
                opacity: 1, scale: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: commentsSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
});
