/**
 * ==========================================================================
 * WORKS PAGE - CINEMATIC ANIMATION SYSTEM
 * Flow: Page Load → Preloader Closes → Video Starts → Text Animates In
 * ==========================================================================
 */

const WORKS_CONFIG = {
  ads: [
    {
      title_en: "Ad Production",
      title_ar: "إنتاج إعلاني",
      desc_en: "Commercial advertisement",
      desc_ar: "إعلان تجاري",
      ytLink: "https://www.youtube.com/embed/6nwjtfsJqqI",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "AD for Dream City Perfume",
      title_ar: "إعلان لعطر دريم سيتي",
      desc_en: "A premium advertisement for Dream City perfume reflecting elegance and charm",
      desc_ar: "إعلان مميز لعطر دريم سيتي يعكس الأناقة والجاذبية",
      ytLink: "https://www.youtube.com/embed/-amrEpPsWkI",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "M2K Hair Product Ad",
      title_ar: "إعلان M2K منتج شعر",
      desc_en: "An attractive advertisement for M2K hair product",
      desc_ar: "إعلان جذاب لمنتج الشعر M2K",
      ytLink: "https://www.youtube.com/embed/mjYvXkYhPq4",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "YalaBook Advertisement",
      title_ar: "إعلان لـ YalaBook",
      desc_en: "Promotional advertisement for YalaBook services",
      desc_ar: "إعلان ترويجي لخدمات YalaBook",
      ytLink: "https://www.youtube.com/embed/XOf3p_xOB-0",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Commercial Advertisement",
      title_ar: "إعلان تجاري",
      desc_en: "Professional commercial advertisement",
      desc_ar: "إعلان تجاري احترافي",
      ytLink: "https://www.youtube.com/embed/VG6PfDQ0LDo",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Ad Production",
      title_ar: "إنتاج إعلاني",
      desc_en: "Commercial advertisement",
      desc_ar: "إعلان تجاري",
      ytLink: "https://www.youtube.com/embed/aq2I41fZvfE",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Ad Production",
      title_ar: "إنتاج إعلاني",
      desc_en: "Commercial advertisement",
      desc_ar: "إعلان تجاري",
      ytLink: "https://www.youtube.com/embed/yxrUNq5vjeE",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Ad Production",
      title_ar: "إنتاج إعلاني",
      desc_en: "Commercial advertisement",
      desc_ar: "إعلان تجاري",
      ytLink: "https://www.youtube.com/embed/80nZhXA625U",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Ad Production",
      title_ar: "إنتاج إعلاني",
      desc_en: "Commercial advertisement",
      desc_ar: "إعلان تجاري",
      ytLink: "https://www.youtube.com/embed/uah-KtVx_Ek",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    }
  ],
  films: [
    {
      title_en: "AI Generated Short Film",
      title_ar: "فيلم قصير صُنع بالذكاء الاصطناعي",
      desc_en: "...where ideas turn into vibrant scenes",
      desc_ar: "…حيث تتحول الأفكار إلى مشاهد نابضة بالحياة",
      ytLink: "https://www.youtube.com/embed/HveAleW0aGs",
      cat_en: "Short Film",
      cat_ar: "فيلم قصير"
    },
    {
      title_en: "The Pharaoh’s Arena",
      title_ar: "أول تجربة سينمائية بالذكاء الاصطناعي",
      desc_en: "A mysterious journey starting inside an ancient pharaonic temple... and ending in a fighting world beyond time...",
      desc_ar: "رحلة غامضة تبدأ من داخل معبد فرعوني قديم… وتنتهي داخل عالم قتال خارج حدود الزمن..",
      ytLink: "https://www.youtube.com/embed/-YCRkHaljSs",
      cat_en: "Short Film",
      cat_ar: "فيلم قصير"
    },
    {
      title_en: "The Pharaoh's Arena - Episode 2",
      title_ar: "الحلقة التانية من حلبه الفرعون",
      desc_en: "Continuation of the Pharaoh's Arena events in a stunning visual experience",
      desc_ar: "تكملة لأحداث حلبة الفرعون في تجربة بصرية مبهرة",
      ytLink: "https://www.youtube.com/embed/9YGxkuWHzrk",
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

  // Animate Section Headers (Typewriter style)
  gsap.utils.toArray("section .mb-10").forEach(container => {
    const title = container.querySelector('h2');
    
    // Delay text split to ensure lang.js translation completes
    setTimeout(() => {
      const originalText = title.textContent;
      title.textContent = "";
      
      const chars = originalText.split("").map(char => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.opacity = "0";
        title.appendChild(span);
        return span;
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.03, ease: "none" });
        
    }, 600);
  });
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
      <div class="video-card-wrapper" style="opacity:0;transform:translateY(50px)">
        <div class="video-card group relative p-3 md:p-4 rounded-[28px] bg-base-200/40 border border-base-content/5 transition-all duration-500 hover:bg-base-200 hover:-translate-y-2 cursor-pointer">
          
          <!-- Elegant Moving Borders (Top & Bottom) -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-700 ease-out group-hover:w-2/3 rounded-full shadow-[0_0_15px_rgba(39,172,244,0.6)] z-20"></div>
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-700 ease-out group-hover:w-2/3 rounded-full shadow-[0_0_15px_rgba(39,172,244,0.6)] z-20"></div>

          <!-- Video Container -->
          <div class="relative w-full rounded-2xl overflow-hidden bg-black shadow-inner" style="aspect-ratio:16/9">
            
            <iframe
              data-src="${p.ytLink}?rel=0&modestbranding=1&autoplay=1"
              src="${p.ytLink}?rel=0&modestbranding=1"
              title="Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full bg-black pointer-events-none"
              loading="lazy">
            </iframe>

            <div class="absolute inset-0 z-10 bg-transparent"
                 onclick="const iframe = this.previousElementSibling; iframe.src = iframe.getAttribute('data-src'); iframe.classList.remove('pointer-events-none'); this.style.display='none';">
            </div>

          </div>
        </div>
      </div>
    `).join('');

    // GSAP reveal for each grid explicitly to guarantee staggering
    gsap.to(grid.querySelectorAll('.video-card-wrapper'), {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.3, // 0.3s solid delay between each card
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
}
