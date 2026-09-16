/**
 * ==========================================================================
 * WORKS PAGE - CINEMATIC ANIMATION SYSTEM
 * Flow: Page Load → Preloader Closes → Video Starts → Text Animates In
 * ==========================================================================
 */

// ─── GLOBAL DATA STORE ───────────────────────────────────────────────────────
const WORKS_DATA = {};

const CAT_META = {
  ads:    { en: 'Ad Production',  ar: 'إنتاج إعلانات' },
  films:  { en: 'Short Films',    ar: 'أفلام قصيرة'   },
  reels:  { en: 'Reels & Clips',  ar: 'ريلز وكليبات'  },
  cinema: { en: 'Cinematic',      ar: 'سينمائي'        },
};

// ─── MODAL STATE ─────────────────────────────────────────────────────────────
const modalState = {
  activeCat:   null,
  activeIndex: 0,
};

// ─── HERO STATE MANAGEMENT ────────────────────────────────────────────────────
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

  // Render video grid (also loads data & builds accordion)
  renderVideos();
  setupScrollAnimations();

  // ── Wait for preloader to finish ──
  window.addEventListener("preloaderFinished", () => {
    preloaderDone = true;

    const heroVideo = document.getElementById("hero-bg-video");

    if (!heroVideo) {
      videoPlaying = true;
      tryStartHeroAnimation();
      return;
    }

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
      onLeave:      () => heroVideo.pause(),
      onEnterBack:  () => heroVideo.play().catch(() => {}),
    });
  });
});

// ─── TEXT SPLITTING ───────────────────────────────────────────────────────────
function prepareHeroText() {
  const heroTitle = document.querySelector('.works-hero-title');
  if (!heroTitle) return;

  const isArabic = document.documentElement.getAttribute('lang') === 'ar';

  if (!isArabic) {
    const parts = heroTitle.innerHTML.split('<br>');
    heroTitle.innerHTML = parts.map(part =>
      part.split('').map(char =>
        `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('')
    ).join('<br>');

    heroTitle.querySelectorAll('.char').forEach(char => {
      if (char.textContent === '\u00a0') return;
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
    heroTitle.classList.add('title-full-hover');
  }
}

// ─── HERO ENTRANCE ANIMATION ──────────────────────────────────────────────────
function runHeroEntrance() {
  const isArabic = document.documentElement.getAttribute('lang') === 'ar';
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.set([".works-hero-title", ".works-hero-subtitle"], { autoAlpha: 1 });

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

  tl.fromTo(".works-hero-subtitle",
    { y: 30, autoAlpha: 0, filter: "blur(6px)" },
    { y: 0,  autoAlpha: 1, filter: "blur(0px)", duration: 1.4 },
    "-=0.6"
  );

  // Animate the Watch button in last
  tl.fromTo("#showreel-btn",
    { y: 24, autoAlpha: 0 },
    { y: 0,  autoAlpha: 1, duration: 1, ease: "back.out(1.5)" },
    "-=0.7"
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

// ─── DATA LOADING ─────────────────────────────────────────────────────────────
async function loadAllData() {
  const categories = ['ads', 'films', 'reels', 'cinema'];
  await Promise.all(categories.map(async (cat) => {
    try {
      const res = await fetch(`src/vidLinks/${cat}.json`);
      const raw = await res.json();
      WORKS_DATA[cat] = raw.reverse(); // LIFO — newest first
    } catch (e) {
      WORKS_DATA[cat] = [];
      console.error(`Error loading ${cat}.json:`, e);
    }
  }));
}

// ─── VIDEO GRID RENDER ────────────────────────────────────────────────────────
async function renderVideos() {
  await loadAllData();

  const categories = ['ads', 'films', 'reels', 'cinema'];

  for (const cat of categories) {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) continue;

    const data = WORKS_DATA[cat];

    grid.innerHTML = data.map((p) => `
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

    gsap.to(grid.querySelectorAll('.video-card-wrapper'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Build accordion sidebar now that data is ready
  buildAccordion();

  // Refresh ScrollTrigger after all dynamic elements are added
  ScrollTrigger.refresh();
}

// ─── MODAL: UTILS ─────────────────────────────────────────────────────────────
function getYtId(ytLink) {
  return ytLink.split('/embed/')[1]?.split('?')[0] || '';
}

// ─── MODAL: BUILD ACCORDION ───────────────────────────────────────────────────
function buildAccordion() {
  const accordion = document.getElementById('modal-accordion');
  if (!accordion) return;

  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  accordion.innerHTML = Object.keys(WORKS_DATA).map((cat) => {
    const videos = WORKS_DATA[cat];
    const label  = CAT_META[cat][isAr ? 'ar' : 'en'];

    const items = videos.map((v, i) => {
      const ytId  = getYtId(v.ytLink);
      const title = isAr ? v.title_ar : v.title_en;
      return `
        <button class="playlist-item" id="pl-item-${cat}-${i}" onclick="playVideo('${cat}', ${i})">
          <div class="playlist-thumb">
            <img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" alt="${title}" loading="lazy"
                 onerror="this.parentElement.style.background='#111'">
          </div>
          <span class="playlist-item-title">${title}</span>
        </button>`;
    }).join('');

    return `
      <div class="acc-item" id="acc-item-${cat}">
        <button class="acc-header" onclick="toggleAccordion('${cat}')">
          <span class="acc-label">${label}</span>
          <span class="acc-count">${videos.length}</span>
          <svg class="acc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="acc-body" id="acc-body-${cat}">${items}</div>
      </div>`;
  }).join('');
}

// ─── MODAL: ACCORDION TOGGLE ─────────────────────────────────────────────────
function toggleAccordion(cat) {
  const categories    = ['ads', 'films', 'reels', 'cinema'];
  const isAlreadyOpen = document.getElementById(`acc-item-${cat}`)?.classList.contains('active');

  // Close all sections
  categories.forEach(c => document.getElementById(`acc-item-${c}`)?.classList.remove('active'));

  // If wasn't open, open it and auto-play its first video
  if (!isAlreadyOpen) {
    document.getElementById(`acc-item-${cat}`)?.classList.add('active');
    playVideo(cat, 0);
  }
}

// ─── MODAL: PLAY VIDEO ────────────────────────────────────────────────────────
function playVideo(cat, index) {
  const data = WORKS_DATA[cat];
  if (!data?.[index]) return;

  modalState.activeCat   = cat;
  modalState.activeIndex = index;

  const video = data[index];
  const isAr  = document.documentElement.getAttribute('lang') === 'ar';

  // Update iframe src (autoplay)
  const iframe = document.getElementById('modal-iframe');
  if (iframe) iframe.src = `${video.ytLink}?autoplay=1&rel=0&modestbranding=1`;

  // Update header info
  const titleEl = document.getElementById('modal-video-title');
  const catEl   = document.getElementById('modal-video-cat');
  if (titleEl) titleEl.textContent = isAr ? video.title_ar : video.title_en;
  if (catEl)   catEl.textContent   = isAr ? video.cat_ar   : video.cat_en;

  // Highlight active playlist item and scroll it into view
  document.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById(`pl-item-${cat}-${index}`);
  activeEl?.classList.add('active');
  activeEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ─── MODAL: NAVIGATE PREV / NEXT ─────────────────────────────────────────────
function navigateModal(direction) {
  const cat  = modalState.activeCat;
  const data = WORKS_DATA[cat];
  if (!data?.length) return;

  let newIndex = modalState.activeIndex + direction;
  if (newIndex < 0)            newIndex = data.length - 1;
  if (newIndex >= data.length) newIndex = 0;

  playVideo(cat, newIndex);
}

// ─── MODAL: OPEN / CLOSE ──────────────────────────────────────────────────────
function openShowreelModal() {
  const modal = document.getElementById('showreel-modal');
  if (!modal) return;

  document.body.style.overflow = 'hidden';
  modal.classList.add('modal-open');

  // Default: open first category if nothing was selected yet
  if (!modalState.activeCat) {
    toggleAccordion('ads');
  } else {
    playVideo(modalState.activeCat, modalState.activeIndex);
  }
}

function closeShowreelModal() {
  const modal = document.getElementById('showreel-modal');
  if (!modal) return;

  document.body.style.overflow = '';
  modal.classList.remove('modal-open');

  // Stop video playback by clearing src
  const iframe = document.getElementById('modal-iframe');
  if (iframe) iframe.src = '';
}

// ─── KEYBOARD SHORTCUTS ──────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('showreel-modal')?.classList.contains('modal-open')) return;
  if (e.key === 'Escape')     closeShowreelModal();
  if (e.key === 'ArrowLeft')  navigateModal(-1);
  if (e.key === 'ArrowRight') navigateModal(1);
});
