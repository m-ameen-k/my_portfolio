(function () {
  var $ = function (s) { return document.querySelector(s); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal on scroll (first, so content can never stay hidden) */
  if ("IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("js");
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("vis"); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll("h2,.txt,.win,.tags,.cta").forEach(function (el) { el.classList.add("rv"); ro.observe(el); });
  }

  /* Clock */
  function tick() { $("#clock").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  tick(); setInterval(tick, 30000);

  /* Boot intro (once per tab session, skippable) */
  var boot = $("#boot"), seen = null;
  try { seen = sessionStorage.getItem("seen"); sessionStorage.setItem("seen", "1"); } catch (e) {}
  function endBoot() { boot.classList.add("off"); setTimeout(function () { boot.style.display = "none"; }, 600); }
  if (reduce || seen) { boot.style.display = "none"; }
  else { boot.onclick = endBoot; document.addEventListener("keydown", endBoot, { once: true }); setTimeout(endBoot, 1200); }

  /* Active section dot */
  var links = [].slice.call(document.querySelectorAll(".dots a"));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section").forEach(function (s) { io.observe(s); });

  /* Project card spotlight */
  $("#projects").addEventListener("pointermove", function (e) {
    var w = e.target.closest ? e.target.closest(".win") : null;
    if (!w) return;
    var r = w.getBoundingClientRect();
    w.style.setProperty("--mx", (e.clientX - r.left) + "px"); w.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* Resume: built from this page's own content, so editing a project here keeps the resume in sync */
  var RESUME_PROJECT_LIMIT = 4;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function buildResume() {
    var name = $(".logo").textContent.trim();
    var role = $(".lede").textContent.trim();
    var cta = [].slice.call(document.querySelectorAll("#contact .cta a")).map(function (a) { return a.href; });
    var mail = cta.filter(function (h) { return h.indexOf("mailto:") === 0; })[0] || "";
    var li = cta.filter(function (h) { return h.indexOf("linkedin.com") > -1; })[0] || "";
    var gh = cta.filter(function (h) { return h.indexOf("github.com") > -1; })[0] || "";
    var skills = [].slice.call(document.querySelectorAll(".tags li")).map(function (el) { return el.textContent.trim(); });
    var edu = "BSc in Computer Science (in progress) — University of the People";
    var cards = [].slice.call(document.querySelectorAll("#projects .win")).slice(0, RESUME_PROJECT_LIMIT);
    var proj = cards.map(function (w) {
      var t = (w.querySelector("h3") || {}).textContent || "";
      var s = (w.querySelector(".chip") || {}).textContent || "";
      var d = (w.querySelector("p") || {}).textContent || "";
      var hrefs = [].slice.call(w.querySelectorAll(".row a")).map(function (a) { return a.href; });
      return "<div class=\"r-proj\"><h3>" + esc(t) + "<span>" + esc(s) + "</span></h3><p>" + esc(d) + "</p>" +
        (hrefs.length ? "<div class=\"r-links\">" + esc(hrefs.join("   ")) + "</div>" : "") + "</div>";
    }).join("");
    $("#resumeDoc").innerHTML =
      "<h1>" + esc(name) + "</h1><p class=\"r-role\">" + esc(role) + "</p>" +
      "<p class=\"r-contact\">" + [mail, li, gh].filter(Boolean).map(esc).join("   ") + "</p>" +
      "<h2>Education</h2><p>" + esc(edu) + "</p>" +
      "<h2>Skills</h2><ul class=\"r-skills\">" + skills.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
      "<h2>Projects</h2>" + proj;
  }
  $("#resumeBtn").onclick = function () {
    buildResume();
    var prevTitle = document.title;
    document.title = "Ameen-K-Resume";
    window.onafterprint = function () { document.title = prevTitle; window.onafterprint = null; };
    window.print();
  };

  /* Galaxy (loads after the page; the site works fine without it) */
  window.addEventListener("load", function () {
    if (!window.THREE) return;
    var cv = $("#gl"), R;
    try { R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, powerPreference: "low-power" }); } catch (e) { return; }
    var sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cam.position.set(0, 0, 5);
    var g = new THREE.Group(); sc.add(g);

    var small = matchMedia("(pointer:coarse)").matches || innerWidth < 700;
    var N = small ? 18000 : 36000, RAD = 5.5, BR = 3;
    var pos = new Float32Array(N * 3), mixa = new Float32Array(N), scl = new Float32Array(N);
    function jit(r) { return Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * r; }
    for (var i = 0; i < N; i++) {
      var rad, ang, ox, oy, oz;
      if (i < N * 0.1) {
        rad = Math.pow(Math.random(), 2) * 1.3; ang = Math.random() * 6.283;
        ox = (Math.random() - 0.5) * 0.4; oz = (Math.random() - 0.5) * 0.4; oy = (Math.random() - 0.5) * 0.7 * (1 - rad / 1.3);
      } else {
        rad = Math.pow(Math.random(), 1.3) * RAD; ang = (i % BR) / BR * 6.283 + rad * 1.1;
        ox = jit(rad); oy = jit(rad) * 0.45; oz = jit(rad);
      }
      pos[i * 3] = Math.cos(ang) * rad + ox; pos[i * 3 + 1] = oy; pos[i * 3 + 2] = Math.sin(ang) * rad + oz;
      mixa[i] = Math.min(1, rad / RAD); scl[i] = 0.25 + Math.random() * 0.75;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aMix", new THREE.BufferAttribute(mixa, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
    var mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: 46 }, uIn: { value: new THREE.Color("#ffd2a0") }, uOut: { value: new THREE.Color("#6f6bff") } },
      vertexShader: [
        "attribute float aScale; attribute float aMix;",
        "uniform float uTime; uniform float uSize; uniform vec3 uIn; uniform vec3 uOut;",
        "varying vec3 vC;",
        "void main(){",
        "  vec3 p = position; float d = length(p.xz);",
        "  float a = atan(p.x, p.z) + uTime * 0.2 / (d * 0.7 + 0.4);",
        "  p.x = sin(a) * d; p.z = cos(a) * d;",
        "  vec4 vp = modelViewMatrix * vec4(p, 1.0);",
        "  gl_Position = projectionMatrix * vp;",
        "  gl_PointSize = uSize * aScale * (1.0 / -vp.z);",
        "  vC = mix(uIn, uOut, aMix);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vC;",
        "void main(){",
        "  float s = 1.0 - distance(gl_PointCoord, vec2(0.5)) * 2.0;",
        "  s = pow(max(s, 0.0), 3.0);",
        "  gl_FragColor = vec4(vC, s * 0.85);",
        "}"
      ].join("\n")
    });
    var U = mat.uniforms;
    var galaxy = new THREE.Points(geo, mat); galaxy.frustumCulled = false; g.add(galaxy);

    var SN = 800, sp = new Float32Array(SN * 3);
    for (i = 0; i < SN; i++) {
      var r = 15 + Math.random() * 35, t = Math.random() * 6.283, p = Math.acos(2 * Math.random() - 1);
      sp[i * 3] = r * Math.sin(p) * Math.cos(t); sp[i * 3 + 1] = r * Math.sin(p) * Math.sin(t); sp[i * 3 + 2] = r * Math.cos(p);
    }
    var sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    var stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.75, depthWrite: false }));
    sc.add(stars);

    var wide = true, mx = 0, my = 0, mxs = 0, mys = 0, sm = 0, running = false;
    function size() {
      var w = cv.clientWidth, h = cv.clientHeight, pr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
      wide = w / h > 1.1;
      R.setPixelRatio(pr); R.setSize(w, h, false);
      U.uSize.value = 46 * pr;
      cam.aspect = w / h; cam.updateProjectionMatrix();
      g.scale.setScalar(wide ? 1 : 0.8);
      if (reduce) frame(0);
    }
    addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    function frame(t) {
      running = false;
      if (document.hidden) return;
      var h = document.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
      sm += (p - sm) * 0.06; mxs += (mx - mxs) * 0.05; mys += (my - mys) * 0.05;
      var k = Math.min(1, sm * 4);
      U.uTime.value = t * 0.001;
      g.rotation.x = 0.55 + sm * 0.7 + mys * 0.2; g.rotation.y = sm * 1.2 + mxs * 0.5;
      g.position.x = wide ? 1.9 * (1 - k) : 0; g.position.y = wide ? 0 : 1.2 * (1 - k);
      cam.position.z = 5 - sm * 1.1;
      cv.style.opacity = 1 - 0.5 * k;
      stars.rotation.y = t * 0.00002;
      R.render(sc, cam);
      if (!reduce) { running = true; requestAnimationFrame(frame); }
    }
    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    size(); addEventListener("resize", size);
    document.addEventListener("visibilitychange", start);
    start();
  });
})();
