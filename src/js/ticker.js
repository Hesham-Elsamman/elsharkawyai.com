document.addEventListener("DOMContentLoaded", function () {
  // GSAP ScrollTrigger for Works Page Elements
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Animate Video Card
      const vidCard = document.querySelector('.vid-card');
      if (vidCard) {
          gsap.fromTo(vidCard, 
              { opacity: 0, x: -100 },
              {
                  opacity: 1, x: 0,
                  duration: 1,
                  ease: "power3.out",
                  scrollTrigger: {
                      trigger: vidCard,
                      start: "top 80%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      }

      // Animate Social Links
      const mediaCards = document.querySelectorAll('.media-card');
      if (mediaCards.length > 0) {
          gsap.fromTo(mediaCards,
              { opacity: 0, y: 50 },
              {
                  opacity: 1, y: 0,
                  duration: 0.8,
                  stagger: 0.15,
                  ease: "back.out(1.7)",
                  scrollTrigger: {
                      trigger: '.social-card',
                      start: "top 85%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      }

      // Animate Ticker Container
      const tickerContainer = document.querySelector('.ticker-container');
      if (tickerContainer) {
          gsap.fromTo(tickerContainer,
              { opacity: 0, scale: 0.95 },
              {
                  opacity: 1, scale: 1,
                  duration: 1.2,
                  delay: 0.4,
                  ease: "power2.out",
                  scrollTrigger: {
                      trigger: tickerContainer,
                      start: "top 95%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      }
  }

  // Ticker Logic (Original)
  const tickerTrack = document.getElementById("tickerTrack");
  if (!tickerTrack) return;
  if (tickerTrack.classList.contains("duplicated")) return;
  tickerTrack.classList.add("duplicated");

  const logos = Array.from(tickerTrack.children);
  const containerWidth = tickerTrack.parentElement.offsetWidth;

  while (
    tickerTrack.offsetWidth < containerWidth * 2 &&
    tickerTrack.children.length < 100
  ) {
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      tickerTrack.appendChild(clone);
    });
  }
});
