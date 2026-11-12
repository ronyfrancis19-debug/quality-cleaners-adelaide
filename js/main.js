(function () {
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
})();
