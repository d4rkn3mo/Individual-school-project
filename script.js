const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider__track");
  const slides = Array.from(slider.querySelectorAll(".slider__slide"));
  const prevBtn = slider.querySelector(".slider__btn--prev");
  const nextBtn = slider.querySelector(".slider__btn--next");
  const dotsWrap = slider.querySelector(".slider__dots");
  let index = 0;
  let timerId = null;

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.querySelectorAll(".slider__dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  slides.forEach((_, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider__dot";
    dot.setAttribute("aria-label", `Слайд ${dotIndex + 1}`);
    dot.addEventListener("click", () => {
      goTo(dotIndex);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  prevBtn.addEventListener("click", () => {
    prev();
    restart();
  });
  nextBtn.addEventListener("click", () => {
    next();
    restart();
  });

  const start = () => {
    if (prefersReducedMotion) return;
    timerId = window.setInterval(next, 5000);
  };

  const stop = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  };

  const restart = () => {
    stop();
    start();
  };

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  goTo(0);
  start();
});
