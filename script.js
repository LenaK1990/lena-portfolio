document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const show = (el) => {
    el.classList.add("is-visible");
  };

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.bottom > 0 &&
      rect.top < vh &&
      rect.right > 0 &&
      rect.left < vw
    );
  };

  const revealIfInView = (obs) => {
    reveals.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      if (!isInViewport(el)) return;
      show(el);
      if (obs) obs.unobserve(el);
    });
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
      threshold: 0,
      rootMargin: "0px 0px 18% 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => revealIfInView(observer));
  });

  window.addEventListener(
    "load",
    () => revealIfInView(observer),
    { once: true }
  );
});
