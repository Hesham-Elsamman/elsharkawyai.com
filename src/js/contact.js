/* src/js/contact.js - Futuristic 2060 Edition */
document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. Inject Animated Background ─── */
    const bg = document.createElement('div');
    bg.className = 'contact-page-bg';
    bg.innerHTML = `
        <div class="grid-lines"></div>
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>
    `;
    document.body.insertBefore(bg, document.body.firstChild);

    /* ─── 2. Inject Tech Ring into Email Card ─── */
    const emailCard = document.querySelector('.bento-email');
    if (emailCard) {
        const ring = document.createElement('div');
        ring.className = 'tech-ring';
        emailCard.appendChild(ring);
    }

    /* ─── 3. GSAP Animations ─── */
    if (typeof gsap !== 'undefined') {

        // Hero entrance
        gsap.to('.contact-title', {
            opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.1,
            clearProps: 'transform'
        });
        gsap.fromTo('.contact-title',
            { y: 60 }, { y: 0, duration: 1.2, ease: 'power4.out', delay: 0.1 }
        );
        gsap.to('.contact-subtitle', {
            opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4
        });

        // Bento card stagger entrance
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.to('.bento-card', {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                    trigger: '.bento-grid',
                    start: 'top 80%',
                },
                clearProps: 'transform'
            });
            gsap.fromTo('.bento-card',
                { y: 60 },
                {
                    y: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: '.bento-grid',
                        start: 'top 80%',
                    }
                }
            );
        }
    }

    /* ─── 4. 3D Tilt + Mouse Glow on each card ─── */
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            // Tilt angles (max ±8deg)
            const tiltX = ((mouseY - cy) / cy) * -6;
            const tiltY = ((mouseX - cx) / cx) * 6;

            // Apply tilt
            card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            // Update CSS vars for radial glow position
            const xPct = (mouseX / rect.width) * 100;
            const yPct = (mouseY / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${xPct}%`);
            card.style.setProperty('--mouse-y', `${yPct}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });

    /* ─── 5. Copy Email Button ─── */
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('asharkawy267@gmail.com').then(() => {
                const originalHtml = copyBtn.innerHTML;

                // Animate feedback
                if (typeof gsap !== 'undefined') {
                    gsap.timeline()
                        .to(copyBtn, { scale: 0.92, duration: 0.1 })
                        .to(copyBtn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' })
                        .to(copyBtn, { scale: 1, duration: 0.15 });
                }

                copyBtn.innerHTML = `<i class="fi fi-rr-check"></i> <span>Copied!</span>`;

                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                    // Re-apply i18n
                    const lang = localStorage.getItem('lang') || 'en';
                    if (window.applyLanguage) window.applyLanguage(lang);
                }, 2500);
            }).catch(() => {
                // Fallback: select text
                const el = document.querySelector('.email-address');
                if (el) {
                    const range = document.createRange();
                    range.selectNode(el);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                }
            });
        });
    }

    /* ─── 6. Magnetic hover effect: nearby cards react ─── */
    const grid = document.querySelector('.bento-grid');
    if (grid) {
        grid.addEventListener('mousemove', (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCx = rect.left + rect.width / 2;
                const cardCy = rect.top + rect.height / 2;
                const dist = Math.sqrt(
                    Math.pow(e.clientX - cardCx, 2) + Math.pow(e.clientY - cardCy, 2)
                );
                const maxDist = 400;
                const factor = Math.max(0, 1 - dist / maxDist);
                // Subtle glow intensity on border based on proximity
                card.style.setProperty('--proximity', factor.toFixed(3));
            });
        });
    }
});
