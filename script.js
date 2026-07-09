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
    const pagination = scroller.parentElement?.querySelector(
      "[data-scroll-pagination]"
    );
    if (!pagination) return;

    const dots = pagination.querySelectorAll(".case-pagination-dot");
    if (dots.length < 2) return;

    let rafId = null;

    const updateActiveDot = () => {
      rafId = null;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const ratio = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
      const activeIndex = ratio < 0.5 ? 0 : 1;
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
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
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        scroller.scrollTo({
          left: i === 0 ? 0 : maxScroll,
          behavior: "smooth",
        });
      });
    });

    updateActiveDot();
  });

  const metricValues = document.querySelectorAll("[data-count-to]");

  if (metricValues.length) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const formatMetric = (el, value) => {
      const prefix = el.dataset.countPrefix || "";
      const suffix = el.dataset.countSuffix || "";
      return `${prefix}${value}${suffix}`;
    };

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateMetric = (el, duration = 1200) => {
      const target = Number(el.dataset.countTo);
      if (!Number.isFinite(target)) return;

      const start = performance.now();
      el.textContent = formatMetric(el, 0);

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * easeOutCubic(progress));
        el.textContent = formatMetric(el, value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window) || reducedMotion) {
      metricValues.forEach((el) => {
        const target = Number(el.dataset.countTo);
        if (Number.isFinite(target)) {
          el.textContent = formatMetric(el, target);
        }
      });
    } else {
      const metricObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.target.dataset.countAnimated) {
              return;
            }

            entry.target.dataset.countAnimated = "true";
            metricObserver.unobserve(entry.target);
            animateMetric(entry.target);
          });
        },
        { threshold: 0.35 }
      );

      metricValues.forEach((el) => metricObserver.observe(el));
    }
  }
});
