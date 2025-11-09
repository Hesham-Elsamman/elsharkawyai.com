document.addEventListener("DOMContentLoaded", function () {
  const tickerTrack = document.getElementById("tickerTrack");
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
