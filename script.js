document.addEventListener("DOMContentLoaded", () => {
  if (typeof console !== "undefined" && console.log) {
    const navEl = document.querySelector("nav.nav");
    const ctaEl = document.querySelector(
      ".case:not(.case--disabled) > a.case-card .case-hover-btn"
    );
    console.log(
      "[lena-portfolio] Navbar selector: nav.nav",
      navEl ?? "(not found)"
    );
    console.log(
      "[lena-portfolio] View project CTA: .case-card .case-hover-btn (span; there is no .view-project in DOM)",
      ctaEl ?? "(not found)"
    );
  }

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

  const navEl = document.querySelector(".nav");
  if (navEl) {
    const syncNavScroll = () => {
      navEl.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", syncNavScroll, { passive: true });
    syncNavScroll();
  }

  document.querySelectorAll("[data-scroll-cards]").forEach((scroller) => {
    const cards = scroller.querySelectorAll(".case-card");
    const pagination = scroller.parentElement?.querySelector(
      "[data-scroll-pagination]"
    );
    if (!cards.length || !pagination) return;

    const dots = pagination.querySelectorAll(".case-pagination-dot");
    if (!dots.length) return;

    let rafId = null;

    const updateActiveDot = () => {
      rafId = null;
      const scrollLeft = scroller.scrollLeft;
      let closestIndex = 0;
      let minDistance = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(card.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === closestIndex);
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateActiveDot);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const card = cards[i];
        if (!card) return;
        scroller.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      });
    });

    updateActiveDot();
  });
});
