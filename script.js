document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const show = (el) => {
    el.classList.add("is-visible");
  };

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh && rect.bottom > 0;
  };

  if (!("IntersectionObserver" in window)) {
    reveals.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 15% 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));

  requestAnimationFrame(() => {
    reveals.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      if (isInViewport(el)) {
        show(el);
        observer.unobserve(el);
      }
    });
  });
});
