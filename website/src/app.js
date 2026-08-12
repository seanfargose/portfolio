if (window.emailjs) emailjs.init("cfQfrN5FcCwiDOv4C");

(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector("i");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem("portfolio-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch (_) {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try { localStorage.setItem("portfolio-theme", theme); } catch (_) {}
  };

  const setTheme = (theme, persist = true) => {
    const next = theme === "light" ? "light" : "dark";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    if (persist) saveTheme(next);
    const light = next === "light";
    if (themeIcon) themeIcon.className = light ? "fas fa-sun" : "fas fa-moon";
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      themeToggle.title = light ? "Switch to dark mode" : "Switch to light mode";
      themeToggle.dataset.theme = next;
    }
  };

  const initialTheme = root.dataset.theme || getStoredTheme() ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  setTheme(initialTheme, false);

  const toggleTheme = (event) => {
    event?.preventDefault();
    setTheme(root.dataset.theme === "light" ? "dark" : "light", true);
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
    themeToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTheme(event);
      }
    });
  }

  const setMobileMenu = (open) => {
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
    mobileMenuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    const icon = mobileMenuToggle.querySelector("i");
    if (icon) icon.className = open ? "fas fa-xmark" : "fas fa-bars";
  };
  mobileMenuToggle?.addEventListener("click", () => setMobileMenu(!mobileMenu?.classList.contains("open")));
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMobileMenu(false)));
  window.addEventListener("resize", () => { if (window.innerWidth > 980) setMobileMenu(false); });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal content as it enters the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Small parallax interaction for the hero stack.
  const hero = document.querySelector(".hero");
  const stack = document.querySelector(".glass-stack");
  if (hero && stack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stack.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    hero.addEventListener("pointerleave", () => { stack.style.transform = ""; });
  }

  // AI Cost Intelligence screenshot gallery.
  const gallery = [
    { src: "src/img/ai-cost-dashboard-1.png", title: "Cost Intelligence Overview" },
    { src: "src/img/ai-cost-dashboard-2.png", title: "Cost Trends & Smart Alerts" },
    { src: "src/img/ai-cost-dashboard-3.png", title: "Department Breakdown & Predictive Insights" }
  ];
  let galleryIndex = 0;
  const modal = document.getElementById("gallery-modal");
  const galleryImage = document.getElementById("gallery-image");
  const galleryTitle = document.getElementById("gallery-title");
  const galleryCount = document.getElementById("gallery-count");

  const renderGallery = () => {
    const item = gallery[galleryIndex];
    if (galleryImage) { galleryImage.src = item.src; galleryImage.alt = item.title; }
    if (galleryTitle) galleryTitle.textContent = item.title;
    if (galleryCount) galleryCount.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  };
  const openGallery = () => { if (!modal) return; galleryIndex = 0; renderGallery(); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeGallery = () => { if (!modal) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  document.querySelectorAll("[data-gallery='finops']").forEach((button) => button.addEventListener("click", openGallery));
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeGallery));
  document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => { galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length; renderGallery(); });
  document.querySelector("[data-gallery-next]")?.addEventListener("click", () => { galleryIndex = (galleryIndex + 1) % gallery.length; renderGallery(); });
  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("open")) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") { galleryIndex = (galleryIndex + 1) % gallery.length; renderGallery(); }
    if (event.key === "ArrowLeft") { galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length; renderGallery(); }
  });

  // Contact form.
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const buttonText = button?.querySelector(".btn-text");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!window.emailjs) { if (status) status.textContent = "Contact service unavailable. Please email me directly."; return; }
      if (button) button.disabled = true;
      if (buttonText) buttonText.textContent = "Sending...";
      if (status) status.textContent = "";
      try {
        await emailjs.send("service_sd13pzf", "template_q24z5rc", {
          from_name: document.getElementById("from_name").value.trim(),
          from_email: document.getElementById("from_email").value.trim(),
          subject: document.getElementById("subject").value.trim(),
          message: document.getElementById("message").value.trim()
        });
        form.reset();
        if (status) status.textContent = "Message sent successfully. Thanks for reaching out!";
      } catch (error) {
        console.error("EmailJS error:", error);
        if (status) status.textContent = "Could not send the message. Please email me directly instead.";
      } finally {
        if (button) button.disabled = false;
        if (buttonText) buttonText.textContent = "Send message";
      }
    });
  }

  // Lightweight 3D-ish cloud/network particle field.
  const canvas = document.getElementById("cloud-canvas");
  const context = canvas?.getContext("2d");
  if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const particles = [];
    const pointer = { x: null, y: null };
    const resize = () => { canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight * devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    const count = Math.min(70, Math.max(35, Math.floor(window.innerWidth / 24)));
    for (let i = 0; i < count; i += 1) particles.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, z: Math.random(), vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .12, r: Math.random() * 1.5 + .5 });
    window.addEventListener("resize", resize); window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; });
    resize();
    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent").trim() || "#61e6b4";
      const blue = styles.getPropertyValue("--accent-2").trim() || "#62a6ff";
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = window.innerWidth + 10; if (p.x > window.innerWidth + 10) p.x = -10; if (p.y < -10) p.y = window.innerHeight + 10; if (p.y > window.innerHeight + 10) p.y = -10;
        let px = p.x, py = p.y;
        if (pointer.x !== null) { const dx = pointer.x - p.x, dy = pointer.y - p.y, dist = Math.hypot(dx, dy); if (dist < 150) { px -= dx * .012; py -= dy * .012; } }
        context.beginPath(); context.arc(px, py, p.r + p.z, 0, Math.PI * 2); context.fillStyle = i % 3 === 0 ? accent : blue; context.globalAlpha = .18 + p.z * .18; context.fill();
        for (let j = i + 1; j < particles.length; j += 1) { const q = particles[j], dx = px - q.x, dy = py - q.y, dist = Math.hypot(dx, dy); if (dist < 115) { context.beginPath(); context.moveTo(px, py); context.lineTo(q.x, q.y); context.strokeStyle = blue; context.globalAlpha = (1 - dist / 115) * .06; context.lineWidth = 1; context.stroke(); } }
      });
      context.globalAlpha = 1; requestAnimationFrame(draw);
    };
    draw();
  }
  // Cloud Ops mini-game — lightweight, touch-friendly and dependency-free.
  const game = document.getElementById("cloud-game");
  const startButton = document.getElementById("game-start");
  const gameTime = document.getElementById("game-time");
  const gameScore = document.getElementById("game-score");
  const gameMessage = document.getElementById("game-message");
  const gameNodes = [...document.querySelectorAll(".game-node")];
  let gameTimer = null;
  let gameStarted = false;
  let score = 0;
  let seconds = 30;

  const updateGameUI = () => {
    if (gameTime) gameTime.textContent = `${seconds}s`;
    if (gameScore) gameScore.textContent = `${score}/8`;
  };

  const finishGame = (success) => {
    clearInterval(gameTimer);
    gameStarted = false;
    gameNodes.forEach((node) => node.classList.remove("target"));
    if (startButton) {
      startButton.disabled = false;
      startButton.querySelector("span").textContent = "Run again";
    }
    if (gameMessage) {
      gameMessage.innerHTML = success
        ? '<i class="fas fa-circle-check"></i> All incidents resolved. Production is green.'
        : '<i class="fas fa-triangle-exclamation"></i> Incident window expired. Try again and restore the fleet faster.';
    }
  };

  const chooseTarget = () => {
    gameNodes.forEach((node) => node.classList.remove("target"));
    const remaining = gameNodes.filter((node) => !node.classList.contains("resolved"));
    if (!remaining.length) return;
    remaining[Math.floor(Math.random() * remaining.length)].classList.add("target");
  };

  const startGame = () => {
    clearInterval(gameTimer);
    gameStarted = true;
    score = 0;
    seconds = 30;
    gameNodes.forEach((node) => node.classList.remove("resolved", "target"));
    if (startButton) {
      startButton.disabled = true;
      startButton.querySelector("span").textContent = "Mission running";
    }
    if (gameMessage) gameMessage.innerHTML = '<i class="fas fa-crosshairs"></i> Find the pulsing node and clear the incident.';
    updateGameUI();
    chooseTarget();
    gameTimer = setInterval(() => {
      seconds -= 1;
      updateGameUI();
      if (seconds <= 0) finishGame(false);
    }, 1000);
  };

  gameNodes.forEach((node) => {
    const resolve = () => {
      if (!gameStarted || !node.classList.contains("target")) return;
      node.classList.remove("target");
      node.classList.add("resolved");
      score += 1;
      updateGameUI();
      if (score >= gameNodes.length) {
        finishGame(true);
        return;
      }
      if (gameMessage) gameMessage.innerHTML = '<i class="fas fa-circle-check"></i> Incident cleared. Next signal acquired.';
      chooseTarget();
    };
    node.addEventListener("click", resolve);
    node.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "mouse") resolve();
    });
  });
  startButton?.addEventListener("click", startGame);
  updateGameUI();

  // Subtle scroll progress indicator.
  const progress = document.getElementById("scroll-progress");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Gentle card tilt on pointer devices only.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".project-card, .research-card, .cloud-domains > div").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();
