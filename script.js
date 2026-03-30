document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");
  const show = (el) => el.classList.add("is-visible");

  let observer = null;

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const revealIfInView = () => {
    if (!observer) return;
    reveals.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      if (!isInViewport(el)) return;
      show(el);
      observer.unobserve(el); // trigger once
    });
  };

  if (!("IntersectionObserver" in window)) {
    reveals.forEach(show);
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target); // trigger once
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));

  // Handle elements already visible on initial paint/load.
  requestAnimationFrame(revealIfInView);
  window.addEventListener("load", revealIfInView, { once: true });
});
