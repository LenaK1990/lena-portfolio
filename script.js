document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
  });

  const heroItems = document.querySelectorAll(".hero .reveal");
  heroItems.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${index * 80}ms`);
  });

  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    reveals.forEach((el) => {
      observer.observe(el);
    });
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (finePointer.matches) {
    document.querySelectorAll(".case-card").forEach((card) => {
      if (card.innerText.toLowerCase().includes("coming soon")) return;

      const btn = card.querySelector(".case-hover-btn");
      if (!btn) return;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
      });
    });
  }

  if (document.body.classList.contains("has-sticky-nav")) {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const threshold = 120;
    const onScroll = () => {
      if (window.scrollY > threshold) {
        nav.classList.add("is-visible");
      } else {
        nav.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
});
