gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ========================================
   Hero Marquee (seamless loop + entrance)
======================================== */
function heroMarquee() {
  const track = document.querySelector(".hero-track");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroDescription = document.querySelector(".hero-description");

  if (!track || !heroTitle) return;

  let marqueeTween = null;

  function startMarquee() {
    const spans = track.querySelectorAll("span");
    if (!spans.length) return;

    if (marqueeTween) marqueeTween.kill();

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const segmentWidth = spans[0].getBoundingClientRect().width + gap;

    gsap.set(track, { x: 0 });

    marqueeTween = gsap.to(track, {
      x: -segmentWidth,
      duration: 18,
      ease: "none",
      repeat: -1,
    });
  }

  function startMarqueeWhenReady() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startMarquee);
    } else {
      startMarquee();
    }
  }

  if (prefersReducedMotion) {
    gsap.set([heroTitle, heroDescription], { clearProps: "all" });
    startMarqueeWhenReady();
    return;
  }

  gsap.set(heroTitle, { yPercent: 110, opacity: 0 });
  gsap.set(heroDescription, { y: 48, opacity: 0 });

  const loadTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  loadTl
    .to(heroTitle, { yPercent: 0, opacity: 1, duration: 1.15 })
    .to(heroDescription, { y: 0, opacity: 1, duration: 0.85 }, "-=0.55")
    .add(startMarqueeWhenReady, "-=0.35");

  if (heroSubtitle) {
    loadTl.fromTo(
      heroSubtitle,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power2.inOut" },
      "-=0.75",
    );
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(startMarqueeWhenReady, 200);
  });
}

/* ========================================
   Scroll Indicator
======================================== */
function scrollIndicator() {
  const indicator = document.querySelector(".scroll-indicator");
  const line = document.querySelector(".scroll-line");
  const dot = document.querySelector(".scroll-dot");
  const label = indicator && indicator.querySelector("span");

  if (!indicator || !line || !dot) return;

  if (prefersReducedMotion) {
    gsap.set(indicator, { opacity: 0 });
    return;
  }

  gsap.set(indicator, { opacity: 1, y: 24 });
  gsap.set(dot, { y: 0, opacity: 1 });

  const indicatorTl = gsap.timeline({
    delay: 1.4,
    defaults: { ease: "power2.out" },
  });

  indicatorTl
    .to(indicator, { opacity: 1, y: 0, duration: 0.8 })
    .from(
      label,
      { letterSpacing: "0.35em", opacity: 0, duration: 0.7 },
      "-=0.5",
    )
    .from(
      line,
      { scaleY: 0, transformOrigin: "top center", duration: 0.6 },
      "-=0.45",
    );

  gsap.to(dot, {
    y: 52,
    opacity: 1,
    duration: 1.6,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(label, {
    opacity: 0.45,
    duration: 1.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    onUpdate: function (self) {
      gsap.to(indicator, {
        opacity: 1 - self.progress,
        y: self.progress * 16,
        duration: 0.2,
        overwrite: "auto",
      });
    },
  });
}

/* ========================================
   Header Entrance
======================================== */
function headerAnimation() {
  const logo = document.querySelector(".logo");
  const navLinks = document.querySelectorAll(".nav-link");

  if (prefersReducedMotion) return;

  gsap.from(logo, {
    y: -24,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    clearProps: "transform,opacity",
  });

  gsap.from(navLinks, {
    y: -16,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    delay: 0.15,
    ease: "power2.out",
    clearProps: "transform,opacity",
  });
}

/* ========================================
   Scroll Animations (ScrollTrigger)
======================================== */
function scrollAnimations() {
  if (prefersReducedMotion) return;

  gsap.from(".selected-works-title", {
    scrollTrigger: {
      trigger: ".selected-works-header",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    y: 60,
    duration: 1,
    ease: "power3.out",
  });

  gsap.utils.toArray(".work-card").forEach(function (card, index) {
    gsap.from(card.querySelector(".work-media"), {
      x: index % 2 === 0 ? -40 : 40,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "top 60%",
        scrub: true,
      },
    });

    gsap.from(card.querySelector(".work-content"), {
      y: 50,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "top 55%",
        scrub: true,
      },
    });
  });

  gsap.from(".about-me-section", {
    scrollTrigger: {
      trigger: ".about",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".about-content .section-title", {
    scrollTrigger: {
      trigger: ".about-content",
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  });

  gsap.from(".about-text", {
    scrollTrigger: {
      trigger: ".about-content",
      start: "top 78%",
      toggleActions: "play none none reverse",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
  });

  gsap.from(".about-tools", {
    scrollTrigger: {
      trigger: ".about-tools",
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    x: 40,
    opacity: 0,
    duration: 0.9,
    ease: "power2.out",
  });

  gsap.from(".tool-tag", {
    scrollTrigger: {
      trigger: ".tools-grid",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    scale: 0.85,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: "back.out(1.7)",
  });

  gsap.from(".career-path", {
    scrollTrigger: {
      trigger: ".experience",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".experience-container > .section-title", {
    scrollTrigger: {
      trigger: ".experience-container",
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  });

  gsap.utils.toArray(".timeline-item").forEach(function (item, index) {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: 0.85,
      delay: index * 0.08,
      ease: "power2.out",
    });

    gsap.from(item.querySelector(".timeline-marker"), {
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      scale: 0,
      duration: 0.5,
      delay: index * 0.08 + 0.15,
      ease: "back.out(2)",
    });
  });

  gsap.from(".get-in-touch", {
    scrollTrigger: {
      trigger: ".contact",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".contact-email", {
    scrollTrigger: {
      trigger: ".contact",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.15,
    ease: "power2.out",
  });

  gsap.from(".social-link", {
    scrollTrigger: {
      trigger: ".social-links",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
    y: 20,
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    stagger: 0.1,
    ease: "back.out(1.7)",
    clearProps: "transform",
  });

  gsap.from(".footer-text", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 95%",
      toggleActions: "play none none reverse",
    },
    y: 20,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
  });
}

/* ========================================
   Mobile Menu
======================================== */
function mobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (!menuToggle || !nav) return;

  const navLinks = nav.querySelectorAll(".nav-link");
  const mobileNavQuery = window.matchMedia("(max-width: 768px)");

  function closeMenu(animate) {
    if (animate) {
      nav.classList.add("nav--animating");
    } else {
      nav.classList.remove("nav--animating");
    }

    menuToggle.classList.remove("active");
    nav.classList.remove("active");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("active");

    nav.classList.add("nav--animating");
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
    document.body.style.overflow = willOpen ? "hidden" : "";
  });

  nav.addEventListener("transitionend", (e) => {
    if (e.target !== nav || e.propertyName !== "transform") return;
    nav.classList.remove("nav--animating");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMenu(true));
  });

  mobileNavQuery.addEventListener("change", (e) => {
    if (!e.matches) {
      closeMenu(false);
    }
  });

  if (!mobileNavQuery.matches) {
    closeMenu(false);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeMenu(true);
    }
  });
}

/* ========================================
   Smooth Scroll
======================================== */
function smoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ========================================
   Header Scroll Effect
======================================== */
function headerScroll() {
  const header = document.querySelector(".header");

  window.addEventListener(
    "scroll",
    function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    },
    { passive: true },
  );
}

/* ========================================
   Tool Tag Hover (GSAP micro-interaction)
======================================== */
function toolTagHover() {
  if (prefersReducedMotion) return;

  document.querySelectorAll(".tool-tag").forEach(function (tag) {
    tag.addEventListener("mouseenter", function () {
      gsap.to(this, {
        scale: 1.06,
        backgroundColor: "var(--accent)",
        color: "#fff",
        borderColor: "var(--accent)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    tag.addEventListener("mouseleave", function () {
      gsap.to(this, {
        scale: 1,
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        borderColor: "var(--dark-color)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

/* ========================================
   Work Link Hover
======================================== */
function workLinkHover() {
  if (prefersReducedMotion) return;

  document.querySelectorAll(".work-link").forEach(function (link) {
    const arrow = link.querySelector("span");

    link.addEventListener("mouseenter", function () {
      gsap.to(link, { y: -2, scale: 1.02, duration: 0.3, ease: "power2.out" });
      if (arrow) gsap.to(arrow, { x: 4, duration: 0.3, ease: "power2.out" });
    });

    link.addEventListener("mouseleave", function () {
      gsap.to(link, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
      if (arrow) gsap.to(arrow, { x: 0, duration: 0.3, ease: "power2.out" });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  mobileMenu();
  headerAnimation();
  heroMarquee();
  scrollIndicator();
  scrollAnimations();
  // worksStackScroll();
  smoothScroll();
  headerScroll();
  toolTagHover();
  workLinkHover();

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
});
