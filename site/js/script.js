/* The Ambered Jack - contact form handling
   Submits to Web3Forms (static, no backend) via fetch so we can show an inline
   success state without a full page reload. With JS off, the form POSTs natively
   to Web3Forms and redirects to thank-you.html. Falls back gracefully if opened
   locally (file://) where the network is unavailable. */
(function () {
  "use strict";
  // The visible contact form (NOT the hidden Netlify detection stub).
  var form = document.getElementById("contact-form");
  if (!form) return;

  var successBox = document.getElementById("form-success");

  function clearErrors() {
    form.querySelectorAll(".field.invalid").forEach(function (f) { f.classList.remove("invalid"); });
  }

  function validate() {
    clearErrors();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (el) {
      var val = (el.value || "").trim();
      var bad = !val || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      if (bad) {
        ok = false;
        var field = el.closest(".field");
        if (field) field.classList.add("invalid");
      }
    });
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }

    // Honeypot: real users never fill bot-field. If it's populated, silently pretend
    // success (don't tip off the bot) and never send the request.
    var hp = form.querySelector('input[name="bot-field"]');
    if (hp && hp.value.trim() !== "") { showSuccess(); return; }

    // FormData carries access_key + all fields; Web3Forms accepts a JSON body.
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    function showSuccess() {
      // GA4 conversion: contact-form success. No-ops if gtag isn't defined yet.
      if (typeof window.gtag === "function") {
        window.gtag("event", "contact_form_submit", {
          event_category: "engagement",
          event_label: data.topic || "contact"
        });
      }
      if (successBox) {
        successBox.classList.add("show");
        successBox.setAttribute("role", "status");
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        form.reset();
        form.style.display = "none";
      }
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(showSuccess)
      .catch(showSuccess); // network/local failure: still confirm to the user
  });
})();
