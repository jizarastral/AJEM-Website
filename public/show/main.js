(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopQuery = window.matchMedia("(min-width: 801px)");
  const fineHover = window.matchMedia("(hover: hover)").matches;

  const stage = document.querySelector(".stage");
  const clips = [...document.querySelectorAll(".clip")];
  const videos = clips.map((clip) => clip.querySelector("video"));
  const bars = [...document.querySelectorAll(".segments b")];
  const tabs = [...document.querySelectorAll(".segments button")];
  const timeEl = document.getElementById("time");
  const pauseBtn = document.getElementById("pause");
  const playGate = document.getElementById("play-gate");
  const playFilm = document.getElementById("play-film");
  const menu = document.getElementById("menu");
  const menuBtn = document.querySelector(".menu-btn");

  let current = 0;
  let started = false;

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
  });

  function isDesktop() {
    return desktopQuery.matches;
  }

  function formatTime(seconds) {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const whole = Math.floor(safe);
    const m = Math.floor(whole / 60);
    const s = String(whole % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function paintProgress(video, index) {
    const ratio = video.duration ? video.currentTime / video.duration : 0;
    bars.forEach((bar, i) => {
      if (i < index) bar.style.transform = "scaleX(1)";
      else if (i === index) bar.style.transform = "scaleX(" + ratio + ")";
      else bar.style.transform = "scaleX(0)";
    });
    if (timeEl) timeEl.textContent = formatTime(video.currentTime);
    tabs.forEach((tab, i) => tab.setAttribute("aria-selected", i === index ? "true" : "false"));
  }

  function showGate() {
    if (playGate) playGate.hidden = false;
  }

  function hideGate() {
    if (playGate) playGate.hidden = true;
    started = true;
  }

  function setPauseLabel(playing) {
    if (!pauseBtn) return;
    pauseBtn.textContent = playing ? "Pause" : "Play";
    pauseBtn.setAttribute("aria-pressed", playing ? "false" : "true");
  }

  function playClip(video) {
    const pending = video.play();
    if (pending && typeof pending.catch === "function") {
      pending.then(() => {
        hideGate();
        setPauseLabel(true);
      }).catch(() => {
        showGate();
        setPauseLabel(false);
      });
    }
  }

  function goTo(index) {
    const next = (index + clips.length) % clips.length;
    const prev = current;
    if (next !== prev) {
      clips[prev].classList.remove("is-on");
      clips[prev].classList.add("is-under");
      videos[prev].pause();
      window.setTimeout(() => clips[prev].classList.remove("is-under"), 720);
    }
    clips.forEach((clip, i) => {
      if (i !== next) clip.classList.remove("is-on");
    });
    clips[next].classList.add("is-on");
    clips.forEach((clip, i) => {
      if (!isDesktop()) clip.removeAttribute("inert");
      else if (i === next) clip.removeAttribute("inert");
      else clip.setAttribute("inert", "");
    });
    const video = videos[next];
    if (next !== prev) video.currentTime = 0;
    const upcoming = videos[(next + 1) % videos.length];
    upcoming.preload = "auto";
    current = next;
    paintProgress(video, next);
    playClip(video);
  }

  videos.forEach((video, index) => {
    video.addEventListener("ended", () => {
      if (reduce) return;
      if (isDesktop()) goTo(index + 1);
      else if (!video.paused) {
        video.currentTime = 0;
        playClip(video);
      }
    });
    video.addEventListener("timeupdate", () => {
      if (!isDesktop() || index !== current) return;
      paintProgress(video, index);
    });
    video.addEventListener("error", () => {
      const note = clips[index].querySelector(".clip-error");
      if (note) note.hidden = false;
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.go);
      if (index === current && isDesktop()) {
        videos[current].currentTime = 0;
        playClip(videos[current]);
        return;
      }
      goTo(index);
    });
  });

  pauseBtn?.addEventListener("click", () => {
    const video = videos[current];
    if (video.paused) playClip(video);
    else {
      video.pause();
      setPauseLabel(false);
    }
  });

  playFilm?.addEventListener("click", () => {
    if (isDesktop()) goTo(current);
    else playClip(videos[0]);
  });

  const mobileWatch = new IntersectionObserver(
    (entries) => {
      if (isDesktop() || reduce) return;
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video");
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) playClip(video);
        else video.pause();
      });
    },
    { threshold: [0.6] }
  );
  clips.forEach((clip) => mobileWatch.observe(clip));

  function startFilm() {
    if (reduce) {
      showGate();
      setPauseLabel(false);
      return;
    }
    if (isDesktop()) goTo(0);
  }

  startFilm();

  function openMenu() {
    menu.classList.add("is-open");
    menu.inert = false;
    menuBtn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
    menu.querySelector("a")?.focus();
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.inert = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
  }

  menuBtn?.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      menuBtn.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;
      event.preventDefault();
      if (menu.classList.contains("is-open")) closeMenu();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  const names = [...document.querySelectorAll(".work-names button")];
  const detail = document.querySelector(".work-detail");
  const meta = document.getElementById("work-meta");
  const scope = document.getElementById("work-scope");
  const who = document.getElementById("work-who");

  let projectToken = 0;
  function selectProject(button) {
    const token = ++projectToken;
    names.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
    if (!detail || !meta || !scope || !who) return;
    detail.classList.add("is-swapping");
    window.setTimeout(() => {
      if (token !== projectToken) return;
      meta.textContent = button.dataset.meta || "";
      scope.textContent = button.dataset.scope || "";
      who.textContent = button.dataset.who || "";
      detail.classList.remove("is-swapping");
    }, reduce ? 0 : 140);
  }

  names.forEach((button) => {
    button.addEventListener("click", () => selectProject(button));
    button.addEventListener("focus", () => selectProject(button));
    if (fineHover) button.addEventListener("pointerenter", () => selectProject(button));
  });

  const form = document.getElementById("visit-form");
  const status = document.getElementById("form-status");

  function setError(id, message) {
    const el = document.getElementById(id);
    const input = document.getElementById(id.replace("-error", ""));
    if (!el) return;
    if (message) {
      el.hidden = false;
      el.textContent = message;
      input?.setAttribute("aria-invalid", "true");
    } else {
      el.hidden = true;
      el.textContent = "";
      input?.removeAttribute("aria-invalid");
    }
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const company = form.company.value.trim();
    const note = form.note.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    let invalid = false;

    if (!name) {
      setError("name-error", "Enter your name.");
      invalid = true;
    } else setError("name-error", "");

    if (phoneDigits.length < 7) {
      setError("phone-error", "Enter a phone number.");
      invalid = true;
    } else setError("phone-error", "");

    if (!note) {
      setError("note-error", "Tell us the site or the job.");
      invalid = true;
    } else setError("note-error", "");

    if (invalid) {
      if (status) status.textContent = "Check the fields marked above.";
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const body = [
      "Name: " + name,
      "Company: " + (company || "Not given"),
      "Phone: " + phone,
      "Site or job: " + note,
    ].join("\n");
    const href =
      "mailto:info@abujasem.ae?subject=" +
      encodeURIComponent("Site visit request") +
      "&body=" +
      encodeURIComponent(body);
    if (status) {
      status.textContent =
        "Your email app should open, addressed to info@abujasem.ae. If it does not, call +971 4 234 7609.";
    }
    window.location.href = href;
  });

  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".reveal").forEach((node) => reveal.observe(node));

    const sectionLinks = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll(".nav-links a[aria-current]").forEach((link) => {
            link.removeAttribute("aria-current");
          });
          const link = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ["practice", "projects", "fitout"].forEach((id) => {
      const node = document.getElementById(id);
      if (node) sectionLinks.observe(node);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("in"));
  }

  function setupMotion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
      document.documentElement.classList.add("js-pan");
      const pin = document.querySelector(".practice-pin");
      const track = document.querySelector(".practice-track");
      if (!pin || !track) return;
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + Math.max(track.scrollWidth - window.innerWidth, 1),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        document.documentElement.classList.remove("js-pan");
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });
  }

  setupMotion();

  desktopQuery.addEventListener("change", () => {
    if (isDesktop() && !reduce && !started) goTo(0);
    window.ScrollTrigger?.refresh();
  });
})();
