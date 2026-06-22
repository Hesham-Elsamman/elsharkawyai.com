/**
 * ==========================================================================
 * WORKS PAGE LOGIC - Cinematic Innovation (SEQUENCED)
 * ==========================================================================
 */

const WORKS_CONFIG = {
  projects: [
    {
      title_en: "Cinematic TV Commercial",
      title_ar: "إعلان تلفزيوني سينمائي",
      desc_en: "A broadcast-ready commercial built on a single human truth.",
      desc_ar: "إعلان تلفزيوني مبني على حقيقة إنسانية واحدة.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Ad Production",
      cat_ar: "إنتاج إعلانات"
    },
    {
      title_en: "Short Film — The Wait",
      title_ar: "فيلم قصير — الانتظار",
      desc_en: "A character study in silence and tension.",
      desc_ar: "دراسة شخصية في الصمت والتوتر.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Short Film",
      cat_ar: "فيلم قصير"
    },
    {
      title_en: "Brand Reel — Social Campaign",
      title_ar: "ريل للعلامة التجارية",
      desc_en: "Vertical content built for the scroll, not the skip.",
      desc_ar: "محتوى رأسي مصمم للتوقف لا التخطي.",
      ytLink: "https://www.youtube.com/embed/BWygxBGZJ9g",
      cat_en: "Reels",
      cat_ar: "ريلز"
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("preloaderFinished", () => {
    // Play hero video after preloader with lazy loading
    const heroVideo = document.getElementById("hero-bg-video");
    if (heroVideo) {
      // Set preload to auto only when needed
      heroVideo.setAttribute('preload', 'auto');
      heroVideo.currentTime = 0;
      heroVideo.load();

      // Handle video load errors
      heroVideo.addEventListener('error', () => {
        console.log('Video failed to load, hiding video element');
        heroVideo.style.display = 'none';
      });

      // Delay play to improve initial load performance
      setTimeout(() => {
        heroVideo.play().catch((err) => {
          console.log("Video play blocked:", err);
          heroVideo.style.display = 'none';
        });
      }, 500);
    }

    setTimeout(initSequencedWorks, 100);
  });
});

function initSequencedWorks() {
  gsap.registerPlugin(ScrollTrigger);

  // Apply translations immediately
  if (window.applyLanguage) {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    window.applyLanguage(currentLang);
  }

  // Hero entrance - clean animation for title and subtitle
  const heroTl = gsap.timeline({ delay: 0.4 });
  heroTl
    .fromTo(".works-hero-title",
      { opacity: 0, y: 40, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "expo.out" })
    .fromTo("#works-hero .mt-6",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");

  renderVideos();

  // Categories Animation
  gsap.from(".category-card", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#works-categories",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // PERFORMANCE OPTIMIZATION: Pause video when off-screen
  ScrollTrigger.create({
    trigger: "#works-hero",
    start: "top top",
    end: "bottom top",
    onLeave: () => {
      const heroVideo = document.getElementById("hero-bg-video");
      if (heroVideo) heroVideo.pause();
    },
    onEnterBack: () => {
      const heroVideo = document.getElementById("hero-bg-video");
      if (heroVideo) heroVideo.play().catch(() => {});
    },
  });
}

function renderVideos() {
  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  const grid = document.getElementById('videos-grid');
  if (!grid) return;

  grid.innerHTML = WORKS_CONFIG.projects.map((p, i) => `
    <div class="video-card opacity-0 group" data-index="${i}">
      <div class="relative rounded-2xl overflow-hidden bg-base-200 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2" style="aspect-ratio: 16/9;">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        <iframe
          src="${p.ytLink}?rel=0&modestbranding=1"
          title="${isAr ? p.title_ar : p.title_en}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy">
        </iframe>
        <div class="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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

  // GSAP reveal
  gsap.to(".video-card", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#works-videos",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}

gsap.set(".video-card", { opacity: 0, y: 40 });
