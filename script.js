document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");
  const show = (el) => el.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target); // trigger once
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  setTimeout(() => {
    reveals.forEach((el) => observer.observe(el));
  }, 100);
});
