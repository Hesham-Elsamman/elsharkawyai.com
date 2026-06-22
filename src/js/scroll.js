/**
 * Premium Smooth Scroll Initialization
 * Powered by Lenis
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
        duration: 1, // Slightly faster for responsiveness
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    // 3. Expose lenis globally in case we need to control it (stop/start)
    window.lenis = lenis;

    // Optional: Log scroll position (debug only)
    // lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    //     console.log({ scroll, limit, velocity, direction, progress })
    // })
});
