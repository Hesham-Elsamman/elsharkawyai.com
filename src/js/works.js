/**
 * ==========================================================================
 * WORKS PAGE - CINEMATIC ANIMATION SYSTEM
 * Flow: Page Load → Preloader Closes → Video Starts → Text Animates In
 * ==========================================================================
 */

const WORKS_CONFIG = {
  ads: [
    {
      title_en: "Commercial Placeholder 1",
      title_ar: "إعلان تجاري 1",
      desc_en: "Placeholder description for ad production.",
      desc_ar: "نص افتراضي لوصف الإعلان التجاري.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Commercial Placeholder 2",
      title_ar: "إعلان تجاري 2",
      desc_en: "Placeholder description for ad production.",
      desc_ar: "نص افتراضي لوصف الإعلان التجاري.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    }
  ],
  films: [
    {
      title_en: "Short Film Placeholder",
      title_ar: "فيلم قصير 1",
      desc_en: "Placeholder description for short films.",
      desc_ar: "نص افتراضي لوصف الفيلم القصير.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Short Film",
      cat_ar: "فيلم قصير"
    }
  ],
  reels: [
    {
      title_en: "Reel Placeholder 1",
      title_ar: "ريل افتراضي 1",
      desc_en: "Placeholder description for reels.",
      desc_ar: "نص افتراضي لوصف الريل.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Reels",
      cat_ar: "ريلز"
    }
  ],
  cinema: [
    {
      title_en: "Cinematic Placeholder",
      title_ar: "إنتاج سينمائي 1",
      desc_en: "Placeholder description for cinematic production.",
      desc_ar: "نص افتراضي لوصف الإنتاج السينمائي.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Cinematic",
      cat_ar: "سينمائي"
    }
  ]
};

// ─── STATE MANAGEMENT ────────────────────────────────────────────────────────
// The hero animation fires ONLY when BOTH the preloader is done AND the video plays
let preloaderDone = false;
let videoPlaying  = false;
let animDone      = false;

function tryStartHeroAnimation() {
  if (preloaderDone && videoPlaying && !animDone) {
    animDone = true;
    runHeroEntrance();
  }
}

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  // Apply language translations first so text is ready before splitting
  if (window.applyLanguage) {
    const lang = document.documentElement.getAttribute('lang') || 'en';
    window.applyLanguage(lang);
  }

  // Prepare text splitting immediately (kept hidden via CSS until animation fires)
  prepareHeroText();

  // Render video grid and setup scroll animations (independent of hero timing)
  renderVideos();
  setupScrollAnimations();

  // ── Wait for preloader to finish ──
  window.addEventListener("preloaderFinished", () => {
    preloaderDone = true;

    const heroVideo = document.getElementById("hero-bg-video");

    if (!heroVideo) {
      // No video element — start animation right away
      videoPlaying = true;
      tryStartHeroAnimation();
      return;
    }

    // Start loading the video
    heroVideo.setAttribute('preload', 'auto');
    heroVideo.currentTime = 0;
    heroVideo.load();

    // ✅ PRIMARY: fire when video actually starts playing frames
    heroVideo.addEventListener('playing', () => {
      videoPlaying = true;
      tryStartHeroAnimation();
    }, { once: true });

    // ✅ FALLBACK 1: video element errored out
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      videoPlaying = true;
      tryStartHeroAnimation();
    }, { once: true });

    // ✅ FALLBACK 2: video blocked by browser autoplay policy
    heroVideo.play().catch(() => {
      videoPlaying = true;
      tryStartHeroAnimation();
    });

    // ✅ FALLBACK 3: slow connection — max wait 1.5s before giving up on video
    setTimeout(() => {
      if (!videoPlaying) {
        videoPlaying = true;
        tryStartHeroAnimation();
      }
    }, 1500);

    // Pause video when hero scrolls off screen (performance)
    ScrollTrigger.create({
      trigger: "#works-hero",
      start: "top top",
      end: "bottom top",
      onLeave: () => heroVideo.pause(),
      onEnterBack: () => heroVideo.play().catch(() => {}),
    });
  });
});

// ─── TEXT SPLITTING ───────────────────────────────────────────────────────────
function prepareHeroText() {
  const heroTitle = document.querySelector('.works-hero-title');
  if (!heroTitle) return;

  const isArabic = document.documentElement.getAttribute('lang') === 'ar';

  if (!isArabic) {
    // Split by <br>, then wrap each character in a <span class="char">
    const parts = heroTitle.innerHTML.split('<br>');
    heroTitle.innerHTML = parts.map(part =>
      part.split('').map(char =>
        `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('')
    ).join('<br>');

    // Per-character hover (identical to home page)
    heroTitle.querySelectorAll('.char').forEach(char => {
      if (char.textContent === '\u00a0') return; // Skip spaces
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          y: -15, scale: 1.2,
          color: "var(--color-primary)",
          textShadow: "0 0 10px var(--color-primary), 0 0 30px var(--color-primary)",
          duration: 0.3, ease: "back.out(2)"
        });
      });
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          y: 0, scale: 1,
          color: "#ffffff",
          textShadow: "0 0 10px rgba(39,172,244,0.3)",
          duration: 0.3, ease: "power2.out"
        });
      });
    });

  } else {
    // Arabic: hover on the full title block
    heroTitle.classList.add('title-full-hover');
  }
}

// ─── HERO ENTRANCE ANIMATION ──────────────────────────────────────────────────
function runHeroEntrance() {
  const isArabic = document.documentElement.getAttribute('lang') === 'ar';
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  // Unhide containers (CSS keeps them invisible initially to prevent FOUC)
  tl.set([".works-hero-title", ".works-hero-subtitle"], { autoAlpha: 1 });

  // ── Title animation ──
  if (!isArabic) {
    tl.fromTo(".works-hero-title .char",
      { y: 100, autoAlpha: 0, skewY: 12, filter: "blur(12px)" },
      { y: 0,   autoAlpha: 1, skewY: 0,  filter: "blur(0px)", duration: 1.5, stagger: 0.07 }
    );
  } else {
    tl.fromTo(".works-hero-title",
      { y: 60, autoAlpha: 0, filter: "blur(10px)" },
      { y: 0,  autoAlpha: 1, filter: "blur(0px)", duration: 1.8 }
    );
  }

  // ── Subtitle (overlaps slightly with title end) ──
  tl.fromTo(".works-hero-subtitle",
    { y: 30, autoAlpha: 0, filter: "blur(6px)" },
    { y: 0,  autoAlpha: 1, filter: "blur(0px)", duration: 1.4 },
    "-=0.6"
  );
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────────────────────
function setupScrollAnimations() {
  gsap.fromTo(".category-card",
    { y: 60, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
      scrollTrigger: {
        trigger: "#works-categories",
        start: "top 82%",
        toggleActions: "play none none none"
      }
    }
  );
}

// ─── VIDEO GRID RENDER ────────────────────────────────────────────────────────
function renderVideos() {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  // Render each category
  const categories = ['ads', 'films', 'reels', 'cinema'];
  
  categories.forEach(cat => {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) return;

    grid.innerHTML = WORKS_CONFIG[cat].map((p, i) => `
      <div class="video-card group" style="opacity:0;transform:translateY(40px)">
        <div class="relative rounded-2xl overflow-hidden bg-base-200 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2" style="aspect-ratio:16/9">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
          <iframe
            src="${p.ytLink}?rel=0&modestbranding=1"
            title="${isAr ? p.title_ar : p.title_en}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy">
          </iframe>
          <div class="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
            <span class="text-primary text-[10px] font-bold uppercase tracking-[0.3em] bg-black/50 px-2 py-1 rounded backdrop-blur-sm">${isAr ? p.cat_ar : p.cat_en}</span>
          </div>
        </div>
        <div class="mt-4 px-1">
          <span class="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">${isAr ? p.cat_ar : p.cat_en}</span>
          <h3 class="text-lg font-black mt-1 group-hover:text-primary transition-colors duration-300">${isAr ? p.title_ar : p.title_en}</h3>
          <p class="text-base-content/60 text-sm mt-1 leading-relaxed">${isAr ? p.desc_ar : p.desc_en}</p>
        </div>
      </div>
    `).join('');
  });

  // GSAP reveal for all video cards together based on scroll
  gsap.utils.toArray(".video-card").forEach(card => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
}
