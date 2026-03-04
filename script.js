const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const toggle = document.querySelector(".navToggle");
  const menu = document.getElementById("mobileNav");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("type") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Website design inquiry — ${type || "Project"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${type}`,
        "",
        message,
      ].join("\n")
    );

    window.location.href = `mailto:dreamgriddesign@gmail.com?subject=${subject}&body=${body}`;
  });
}

function initParallax() {
  const els = Array.from(document.querySelectorAll("[data-parallax]"));
  if (els.length === 0) return;
  if (prefersReducedMotion.matches) return;

  const speeds = new Map();
  for (const el of els) {
    const s = Number(el.getAttribute("data-speed") || "0.2");
    speeds.set(el, clamp(s, -1, 1));
    el.style.transform = "translate3d(0,0,0)";
    el.style.willChange = "transform";
  }

  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 1;

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      const speed = speeds.get(el) ?? 0.2;
      const center = rect.top + rect.height / 2;
      const rel = (center - vh / 2) / vh;
      const translate = clamp(rel * -90 * speed, -90, 90);
      el.style.transform = `translate3d(0, ${translate}px, 0)`;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

function initHeroOrbs() {
  if (prefersReducedMotion.matches) return;
  const orbs = Array.from(document.querySelectorAll(".orb"));
  if (orbs.length === 0) return;

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;

  function tick() {
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;

    orbs.forEach((orb, i) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const dx = (mx / w - 0.5) * (18 + i * 8);
      const dy = (my / h - 0.5) * (14 + i * 7);
      orb.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });

    raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    tx = e.clientX;
    ty = e.clientY;
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  raf = requestAnimationFrame(tick);

  window.addEventListener("blur", () => {
    cancelAnimationFrame(raf);
  });
}

initYear();
initMobileNav();
initContactForm();
initParallax();
initHeroOrbs();
