document.addEventListener("DOMContentLoaded", () => {
  const heroItems = document.querySelectorAll(".hero-reveal");
  const revealItems = document.querySelectorAll(".project-reveal");

  // Page-load reveal for hero elements.
  requestAnimationFrame(() => {
    heroItems.forEach((item) => item.classList.add("is-visible"));
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // trigger once
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
});
