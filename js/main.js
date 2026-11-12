(function () {
  document.documentElement.classList.add("js");

  var header = document.getElementById("header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var form = document.getElementById("quote-form");
  var note = document.getElementById("form-note");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960) closeNav();
    });
  }

  function showNote(message, isError) {
    if (!note) return;
    note.hidden = false;
    note.textContent = message;
    note.classList.toggle("is-error", !!isError);
  }

  if (form) {
    var params = new URLSearchParams(window.location.search);
    var raw = (params.get("service") || "").trim();
    if (raw) {
      var select = form.elements.service;
      var slugMap = {
        "domestic-cleaning": "Domestic cleaning",
        "commercial-cleaning": "Commercial cleaning",
        "end-of-lease-cleaning": "End-of-lease / exit cleaning",
        "end-of-lease": "End-of-lease / exit cleaning",
        "carpet-shampooing": "Carpet shampooing",
        "steam-cleaning": "Steam cleaning",
        "general-deep-cleaning": "General deep cleaning"
      };
      var target = slugMap[raw] || slugMap[raw.toLowerCase()] || raw;
      var matched = false;
      for (var i = 0; i < select.options.length; i++) {
        var opt = select.options[i];
        if (opt.value === target || opt.text === target || opt.value.toLowerCase() === raw.toLowerCase()) {
          select.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (matched) {
        select.focus({ preventScroll: true });
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = ["name", "phone", "email", "suburb", "service"];
      var missing = [];
      fields.forEach(function (id) {
        var el = form.elements[id];
        if (!el) return;
        var empty = !String(el.value || "").trim();
        var invalidEmail = id === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
        el.classList.toggle("is-invalid", empty || invalidEmail);
        if (empty) missing.push(id);
        else if (invalidEmail) missing.push("a valid email");
      });
      if (missing.length) {
        showNote("Please complete the highlighted fields so we can get back to you.", true);
        var first = form.querySelector(".is-invalid");
        if (first) first.focus();
        return;
      }

      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var email = form.elements.email.value.trim();
      var suburb = form.elements.suburb.value.trim();
      var service = form.elements.service.value.trim();
      var message = (form.elements.message.value || "").trim();

      var subject = "Quote request — " + service + " — " + suburb;
      var body = [
        "Hello Quality Cleaners,",
        "",
        "I would like a quote with the details below.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Email: " + email,
        "Suburb: " + suburb,
        "Service: " + service,
        "",
        "Message:",
        message || "(No additional message)",
        "",
        "Sent from the Quality Cleaners website quote form."
      ].join("\r\n");

      var url =
        "mailto:qcadelaide@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      showNote("Opening your email app with this request addressed to qcadelaide@gmail.com. Send it from there to complete the quote request.", false);
      window.location.href = url;
    });

    form.addEventListener("input", function (event) {
      if (event.target && event.target.classList) {
        if (String(event.target.value || "").trim()) {
          event.target.classList.remove("is-invalid");
        }
      }
    });
  }

  var videoWrap = document.querySelector("[data-service-video]");
  if (videoWrap) {
    var video = videoWrap.querySelector("video");
    var placeholder = videoWrap.querySelector(".video-placeholder");
    if (video && placeholder) {
      var motion = window.matchMedia("(prefers-reduced-motion: reduce)");

      function armAutoplay() {
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.controls = false;
        video.setAttribute("muted", "");
        video.setAttribute("loop", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.removeAttribute("controls");
      }

      function playService() {
        armAutoplay();
        if (motion.matches || document.hidden) {
          video.pause();
          try { video.currentTime = 0; } catch (err) {}
          return;
        }
        var play = video.play();
        if (play && typeof play.catch === "function") {
          play.catch(function () {});
        }
      }

      function showPlaceholder() {
        placeholder.hidden = false;
        video.setAttribute("hidden", "");
        videoWrap.classList.add("is-pending");
        videoWrap.classList.remove("is-ready");
      }
      function showVideo() {
        placeholder.hidden = true;
        video.removeAttribute("hidden");
        videoWrap.classList.add("is-ready");
        videoWrap.classList.remove("is-pending");
        playService();
      }

      armAutoplay();
      video.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        playService();
      });
      video.addEventListener("pause", function () {
        if (!motion.matches && !document.hidden && videoWrap.classList.contains("is-ready")) {
          playService();
        }
      });
      if (motion.addEventListener) motion.addEventListener("change", playService);
      else if (motion.addListener) motion.addListener(playService);
      document.addEventListener("visibilitychange", playService);
      video.addEventListener("loadedmetadata", showVideo);
      video.addEventListener("canplay", showVideo);
      video.addEventListener("error", showPlaceholder);
      if (video.error || video.hasAttribute("hidden") || videoWrap.classList.contains("is-pending")) {
        showPlaceholder();
      }
      try { video.load(); } catch (err) { showPlaceholder(); }
    }
  }


  var heroVideo = document.querySelector(".hero-media video");
  if (heroVideo) {
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function playHero() {
      if (motion.matches || document.hidden) {
        heroVideo.pause();
        return;
      }
      var play = heroVideo.play();
      if (play && typeof play.catch === "function") {
        play.catch(function () {});
      }
    }
    function onMotionChange() {
      if (motion.matches) {
        heroVideo.pause();
      } else {
        playHero();
      }
    }
    if (motion.addEventListener) motion.addEventListener("change", onMotionChange);
    else if (motion.addListener) motion.addListener(onMotionChange);
    document.addEventListener("visibilitychange", playHero);
    playHero();
  }

  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

})();
