/* =========================================================================
   THE AMBERED JACK — site.js
   Quality-of-life interactions, loaded with `defer` on every page.
   No dependencies. Progressive enhancement: the site is fully usable with
   JavaScript disabled (this file only *adds* polish, never gates content).

   Sections below:
     0) Event pop-up config (DORMANT — see AJ_EVENT, off by default)
     1) Footer year
     2) Sticky header scroll state
     3) Accessible mobile nav drawer
     4) Hours: SINGLE SOURCE OF TRUTH (open/closed chip + hours list + JSON-LD)
     5) Scroll-reveal animations
     6) Menu page: jump-to-section chip bar (active highlighting + smooth scroll)
     7) Google Analytics event hooks (phone-click; form-success fires in script.js)
     8) Event pop-up (built from AJ_EVENT when enabled + in date range)
   ========================================================================= */
(function () {
  "use strict";

  /* =======================================================================
     0) EVENT POP-UP CONFIG — DORMANT BY DEFAULT.
     -----------------------------------------------------------------------
     To run a site-wide event promo:
       1. Set enabled: true
       2. Fill in title / body / ctaText / ctaHref
       3. Set start / end (YYYY-MM-DD, inclusive) to the promo window
       4. BUMP the id to something new (e.g. "2026-fall-festival") so anyone
          who dismissed a previous pop-up sees the new one.
     The modal only appears when enabled === true AND today is within
     start..end. Dismissal is remembered per-visitor in localStorage, keyed
     by id. Uses text only — never AI placeholder art.
     ===================================================================== */
  var AJ_EVENT = {
    enabled: false,
    id: "2026-example-event",
    title: "Live Music This Friday",
    body: "Join us Friday night for live acoustic music and our slow-roasted prime rib special. No cover, family welcome.",
    ctaText: "See the Specials",
    ctaHref: "index.html#specials",
    start: "2026-09-01",
    end: "2026-09-15"
  };

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DRAWER_MQ = "(max-width: 900px)";

  /* =======================================================================
     1) FOOTER YEAR
     ===================================================================== */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* =======================================================================
     2) STICKY HEADER SCROLL STATE
     ===================================================================== */
  var header = document.querySelector("header.nav");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =======================================================================
     3) ACCESSIBLE MOBILE NAV DRAWER
     ===================================================================== */
  (function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    var backdrop = document.querySelector(".drawer-backdrop");
    if (!toggle || !nav) return;

    function isMobile() {
      return window.matchMedia(DRAWER_MQ).matches;
    }

    function focusables() {
      return Array.prototype.slice.call(
        nav.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function setNav(open) {
      nav.classList.toggle("is-open", open);
      if (backdrop) {
        backdrop.classList.toggle("is-open", open);
        if (open) backdrop.removeAttribute("hidden");
        else backdrop.setAttribute("hidden", "");
      }
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var f = focusables();
        if (f.length) f[0].focus();
      } else {
        // Return focus to the menu button that controls the drawer.
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () { setNav(false); });
    }

    // Close on Escape; trap focus with Tab while open.
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setNav(false);
        return;
      }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    // Tapping any link closes the drawer.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && isMobile()) setNav(false);
    });

    // Reset cleanly when resized back up to desktop.
    window.addEventListener("resize", function () {
      if (!isMobile() && nav.classList.contains("is-open")) setNav(false);
    });
  })();

  /* =======================================================================
     4) HOURS — SINGLE SOURCE OF TRUTH
     -----------------------------------------------------------------------
     To change the restaurant's hours, edit ONLY the AJ_HOURS array below.
     This one value drives, on every page:
       1) the live open/closed status chip   ([data-status])
       2) any rendered hours list             ([data-hours-list])
       3) the JSON-LD openingHoursSpecification (patched into the schema)
     Static HTML mirrors (visible hours text + static JSON-LD) exist so the
     site stays correct for crawlers / JS-off visitors; at runtime this file
     overwrites them to stay in sync. Timezone is America/New_York.
     ===================================================================== */
  // day index 0=Sun … 6=Sat. open/close in 24h minutes. null = closed.
  var AJ_HOURS = [
    { day: 0, name: "Sunday",    open: null,       close: null },     // closed
    { day: 1, name: "Monday",    open: null,       close: null },     // closed
    { day: 2, name: "Tuesday",   open: 11 * 60,    close: 21 * 60 },
    { day: 3, name: "Wednesday", open: 11 * 60,    close: 21 * 60 },
    { day: 4, name: "Thursday",  open: 11 * 60,    close: 21 * 60 },
    { day: 5, name: "Friday",    open: 11 * 60,    close: 21 * 60 },
    { day: 6, name: "Saturday",  open: 11 * 60,    close: 21 * 60 }
  ];
  var TZ = "America/New_York";
  var SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ampm = h >= 12 ? "pm" : "am";
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + (m ? ":" + (m < 10 ? "0" + m : m) : "") + ampm;
  }

  // Current time in the restaurant's timezone (robust against visitor TZ).
  function nowInTZ() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var wkMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var d = wkMap[map.weekday];
      var hh = parseInt(map.hour, 10) % 24;
      var mm = parseInt(map.minute, 10);
      return { day: d, mins: hh * 60 + mm };
    } catch (e) {
      var n = new Date();
      return { day: n.getDay(), mins: n.getHours() * 60 + n.getMinutes() };
    }
  }

  function statusNow() {
    var t = nowInTZ();
    var today = AJ_HOURS[t.day];
    var result = { open: false, label: "Closed", detail: "" };
    if (today.open != null && t.mins >= today.open && t.mins < today.close) {
      result.open = true;
      result.label = "Open now";
      var minsLeft = today.close - t.mins;
      result.detail = minsLeft <= 60
        ? "Closes at " + fmt(today.close)
        : "Open until " + fmt(today.close);
      return result;
    }
    // find next opening (later today, or an upcoming day)
    for (var i = 0; i < 7; i++) {
      var idx = (t.day + i) % 7;
      var d = AJ_HOURS[idx];
      if (d.open == null) continue;
      if (i === 0 && t.mins < d.open) { result.detail = "Opens " + fmt(d.open) + " today"; return result; }
      if (i > 0) { result.detail = "Opens " + d.name + " at " + fmt(d.open); return result; }
    }
    return result;
  }

  function renderStatus() {
    var els = document.querySelectorAll("[data-status]");
    if (!els.length) return;
    var s = statusNow();
    els.forEach(function (el) {
      el.classList.remove("is-open", "is-closed");
      el.classList.add(s.open ? "is-open" : "is-closed");
      var label = el.querySelector("[data-status-label]");
      var detail = el.querySelector("[data-status-detail]");
      if (label) label.textContent = s.label;
      if (detail) detail.textContent = s.detail;
      el.setAttribute("title", s.label + (s.detail ? " — " + s.detail : ""));
    });
  }

  function renderHoursList() {
    var lists = document.querySelectorAll("[data-hours-list]");
    if (!lists.length) return;
    var t = nowInTZ();
    var order = [2, 3, 4, 5, 6, 0, 1]; // Tue..Sat, then closed days
    lists.forEach(function (ul) {
      while (ul.firstChild) ul.removeChild(ul.firstChild);
      order.forEach(function (di) {
        var d = AJ_HOURS[di];
        var li = document.createElement("li");
        if (di === t.day) li.classList.add("is-today");
        var label = d.open == null ? "Closed" : fmt(d.open) + " – " + fmt(d.close);
        var nameEl = document.createElement("span"); nameEl.className = "d"; nameEl.textContent = d.name;
        var timeEl = document.createElement("span"); timeEl.className = "t"; timeEl.textContent = label;
        li.appendChild(nameEl); li.appendChild(timeEl);
        ul.appendChild(li);
      });
    });
  }

  // Build schema openingHoursSpecification from AJ_HOURS (group identical ranges).
  function buildSpec() {
    var groups = {};
    AJ_HOURS.forEach(function (d) {
      if (d.open == null) return;
      var key = d.open + "-" + d.close;
      (groups[key] = groups[key] || { days: [], open: d.open, close: d.close }).days.push(SCHEMA_DAYS[d.day]);
    });
    return Object.keys(groups).map(function (k) {
      var g = groups[k];
      function hm(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm; }
      return { "@type": "OpeningHoursSpecification", "dayOfWeek": g.days, "opens": hm(g.open), "closes": hm(g.close) };
    });
  }

  // Patch the Restaurant JSON-LD so structured hours always match AJ_HOURS.
  function patchSchema() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(function (s) {
      try {
        var data = JSON.parse(s.textContent);
        var nodes = Array.isArray(data) ? data : [data];
        var changed = false;
        nodes.forEach(function (n) {
          if (n && (n["@type"] === "Restaurant" ||
              (Array.isArray(n["@type"]) && n["@type"].indexOf("Restaurant") > -1))) {
            n.openingHoursSpecification = buildSpec();
            changed = true;
          }
        });
        if (changed) s.textContent = JSON.stringify(Array.isArray(data) ? data : nodes[0], null, 2);
      } catch (e) { /* leave the static fallback intact */ }
    });
  }

  renderStatus();
  renderHoursList();
  patchSchema();
  setInterval(renderStatus, 60 * 1000); // refresh the live chip each minute

  // Expose for other scripts / quick console checks.
  window.AJ = window.AJ || {};
  window.AJ.hours = AJ_HOURS;
  window.AJ.statusNow = statusNow;

  /* =======================================================================
     5) SCROLL-REVEAL ANIMATIONS
     -----------------------------------------------------------------------
     CSS only hides .reveal when `html.js` AND prefers-reduced-motion is
     "no-preference", so JS-off and reduced-motion visitors always see
     content immediately. Here we just toggle .is-in as elements enter view,
     and reveal everything up front if IntersectionObserver is missing.
     ===================================================================== */
  (function () {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  })();

  /* =======================================================================
     6) MENU PAGE — JUMP-TO-SECTION CHIP BAR
     -----------------------------------------------------------------------
     Smooth-scrolls to a category section (respecting reduced motion) and
     highlights the chip for the section currently in view.
     ===================================================================== */
  (function () {
    var bar = document.querySelector(".menu-chipbar");
    if (!bar) return;
    var chips = Array.prototype.slice.call(bar.querySelectorAll("a[href^='#']"));
    if (!chips.length) return;

    var byId = {};
    chips.forEach(function (chip) {
      var id = chip.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) byId[id] = chip;
    });

    chips.forEach(function (chip) {
      chip.addEventListener("click", function (e) {
        var id = chip.getAttribute("href").slice(1);
        var section = document.getElementById(id);
        if (!section) return; // let the browser handle a missing target
        e.preventDefault();
        section.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
        // Move focus to the section heading for keyboard/AT users.
        var heading = section.querySelector("h2, h3, [tabindex]");
        if (heading) {
          if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        history.replaceState(null, "", "#" + id);
        setActive(id); // immediate feedback; the scroll-spy keeps it in sync after
      });
    });

    function setActive(id) {
      chips.forEach(function (chip) {
        var on = chip.getAttribute("href") === "#" + id;
        chip.classList.toggle("is-active", on);
        if (on) {
          chip.setAttribute("aria-current", "true");
          // keep the active chip in view inside the horizontal scroller
          if (typeof chip.scrollIntoView === "function") {
            try { chip.scrollIntoView({ inline: "center", block: "nearest", behavior: reduceMotion ? "auto" : "smooth" }); }
            catch (e) { /* older browsers: ignore */ }
          }
        } else {
          chip.removeAttribute("aria-current");
        }
      });
    }

    if ("IntersectionObserver" in window) {
      var visible = {};
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
        });
        // pick the most-visible tracked section
        var bestId = null, best = 0;
        Object.keys(byId).forEach(function (id) {
          var r = visible[id] || 0;
          if (r > best) { best = r; bestId = id; }
        });
        if (bestId) setActive(bestId);
      }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] });
      Object.keys(byId).forEach(function (id) {
        var s = document.getElementById(id);
        if (s) spy.observe(s);
      });
    }
  })();

  /* =======================================================================
     7) GOOGLE ANALYTICS — phone-click events
     -----------------------------------------------------------------------
     Form-success conversion fires from js/script.js. Both calls no-op if
     gtag is not present (e.g. before the owner adds the real GA4 ID).
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!link) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", "phone_call_click", {
        event_category: "engagement",
        event_label: link.getAttribute("href")
      });
    }
  });

  /* =======================================================================
     8) EVENT POP-UP (built from AJ_EVENT when enabled + within date range)
     ===================================================================== */
  (function () {
    if (!AJ_EVENT || AJ_EVENT.enabled !== true) return;

    // Date window check (inclusive). Dates are plain YYYY-MM-DD.
    var todayKey = (function () {
      try {
        return new Intl.DateTimeFormat("en-CA", {
          timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
        }).format(new Date()); // en-CA gives YYYY-MM-DD
      } catch (e) {
        return new Date().toISOString().slice(0, 10);
      }
    })();
    if (AJ_EVENT.start && todayKey < AJ_EVENT.start) return;
    if (AJ_EVENT.end && todayKey > AJ_EVENT.end) return;

    var storeKey = "aj_event_dismissed_" + AJ_EVENT.id;
    try { if (window.localStorage.getItem(storeKey) === "1") return; } catch (e) { /* private mode: just show it */ }

    var lastFocus = document.activeElement;

    var backdrop = document.createElement("div");
    backdrop.className = "aj-modal-backdrop";

    var modal = document.createElement("div");
    modal.className = "aj-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "aj-modal-title");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "aj-modal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";

    var h = document.createElement("h2");
    h.id = "aj-modal-title";
    h.textContent = AJ_EVENT.title || "";

    var p = document.createElement("p");
    p.textContent = AJ_EVENT.body || "";

    modal.appendChild(closeBtn);
    modal.appendChild(h);
    modal.appendChild(p);

    if (AJ_EVENT.ctaText && AJ_EVENT.ctaHref) {
      var cta = document.createElement("a");
      cta.className = "btn btn-amber";
      cta.href = AJ_EVENT.ctaHref;
      cta.textContent = AJ_EVENT.ctaText;
      modal.appendChild(cta);
    }

    backdrop.appendChild(modal);

    function close() {
      try { window.localStorage.setItem(storeKey, "1"); } catch (e) { /* ignore */ }
      document.removeEventListener("keydown", onKey, true);
      backdrop.remove();
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "Tab") {
        var f = Array.prototype.slice.call(modal.querySelectorAll('a[href], button:not([disabled])'));
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });
    document.addEventListener("keydown", onKey, true);

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  })();
})();
