/* =====================================================================
   2D CANVAS BACKGROUND
===================================================================== */
const bgC = document.getElementById("bg-canvas");
const bgX = bgC.getContext("2d");

function resizeBg() {
  bgC.width = innerWidth;
  bgC.height = innerHeight;
}
resizeBg();
window.addEventListener("resize", resizeBg);

const GRID_COLS = 28,
  GRID_ROWS = 18;
function drawGrid() {
  const cw = bgC.width,
    ch = bgC.height;
  const gx = cw / GRID_COLS,
    gy = ch / GRID_ROWS;
  bgX.clearRect(0, 0, cw, ch);

  const vx = cw / 2,
    vy = ch * 0.92;
  bgX.strokeStyle = "rgba(30,30,44,0.55)";
  bgX.lineWidth = 0.8;
  for (let i = 0; i <= GRID_COLS; i++) {
    const x = i * gx;
    bgX.beginPath();
    bgX.moveTo(vx + (x - vx) * 0.05, vy);
    bgX.lineTo(x, 0);
    bgX.stroke();
  }
  for (let j = 0; j <= GRID_ROWS; j++) {
    const y = j * gy;
    bgX.beginPath();
    bgX.moveTo(0, y);
    bgX.lineTo(cw, y);
    bgX.stroke();
  }

  for (let i = 0; i <= GRID_COLS; i++) {
    for (let j = 0; j <= GRID_ROWS; j++) {
      const x = i * gx,
        y = j * gy;
      bgX.beginPath();
      bgX.arc(x, y, 0.9, 0, Math.PI * 2);
      bgX.fillStyle = "rgba(55,55,70,.6)";
      bgX.fill();
    }
  }
}
drawGrid();
window.addEventListener("resize", drawGrid);

const SP_COUNT = 180;
const sparks = Array.from({ length: SP_COUNT }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  vy: -(Math.random() * 0.55 + 0.1),
  vx: (Math.random() - 0.5) * 0.22,
  r: Math.random() * 1.5 + 0.3,
  alpha: Math.random() * 0.5 + 0.1,
  hue: Math.random() < 0.65 ? "orange" : Math.random() < 0.5 ? "amber" : "teal"
}));

const COLS_SP = { orange: "rgba(255,85,0,", amber: "rgba(255,170,0,", teal: "rgba(0,240,200," };

const fxC = document.getElementById("fx-canvas");
const fxX = fxC.getContext("2d");

function resizeFx() {
  fxC.width = innerWidth;
  fxC.height = innerHeight;
}
resizeFx();
window.addEventListener("resize", resizeFx);

let fxParticles = [];
class FxPt {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    const a = Math.random() * Math.PI * 2,
      sp = Math.random() * 5 + 0.8;
    this.vx = Math.cos(a) * sp;
    this.vy = Math.sin(a) * sp - 1.4;
    this.life = 1;
    this.decay = 0.022 + Math.random() * 0.025;
    this.r = 0.8 + Math.random() * 2.4;
    this.col = col;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.07;
    this.vx *= 0.985;
    this.life -= this.decay;
  }
  draw() {
    fxX.save();
    fxX.globalAlpha = this.life * 0.8;
    fxX.fillStyle = this.col;
    fxX.shadowBlur = 5;
    fxX.shadowColor = this.col;
    fxX.beginPath();
    fxX.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    fxX.fill();
    fxX.restore();
  }
}
function burst(x, y, n, cols) {
  for (let i = 0; i < n; i++) fxParticles.push(new FxPt(x, y, cols[Math.floor(Math.random() * cols.length)]));
}

function bgLoop() {
  requestAnimationFrame(bgLoop);
  fxX.clearRect(0, 0, fxC.width, fxC.height);
  for (const s of sparks) {
    s.x += s.vx;
    s.y += s.vy;
    if (s.y < -4) {
      s.y = fxC.height + 4;
      s.x = Math.random() * fxC.width;
    }
    fxX.beginPath();
    fxX.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    fxX.fillStyle = COLS_SP[s.hue] + s.alpha + ")";
    fxX.fill();
  }
  fxParticles = fxParticles.filter((p) => p.life > 0);
  fxParticles.forEach((p) => {
    p.update();
    p.draw();
  });
}
bgLoop();

/* =====================================================================
   TRANSITIONS & HELPERS
===================================================================== */
function flashFx() {
  const el = document.getElementById("flash");
  gsap.killTweensOf(el);
  gsap.to(el, { opacity: 0.05, duration: 0.04 });
  gsap.to(el, { opacity: 0, duration: 0.26, delay: 0.04 });
}

function slideTransition(tl, t) {
  const slices = document.querySelectorAll(".tt-slice");

  tl.call(
    () => {
      // Les panneaux pairs viennent de la gauche, impairs de la droite
      slices.forEach((slice, i) => {
        gsap.set(slice, { xPercent: i % 2 === 0 ? -100 : 100 });
      });
    },
    [],
    t
  )

    // Rentre et couvre l'ecran
    .to(
      slices,
      {
        xPercent: 0,
        duration: 0.45,
        ease: "power2.inOut",
        stagger: 0.03
      },
      t
    )

    // Flash cybernetique quand l'ecran est cache
    .call(
      () => {
        flashFx();
        burst(innerWidth / 2, innerHeight / 2, 35, ["#00F0C8", "#FF5500", "#FFAA00", "#9B8BF4"]);
      },
      [],
      t + 0.5
    )

    // Ressort de l'autre cote (Continue son mouvement comme un scan complet)
    .to(
      slices,
      {
        xPercent: (i) => (i % 2 === 0 ? 100 : -100),
        duration: 0.45,
        ease: "power2.inOut",
        stagger: {
          each: 0.03,
          from: "end" // Ouvre dans l'autre sens (du bas vers le haut)
        }
      },
      t + 0.6
    );
}

function showSlide(id, tl, t, dur = 3.2) {
  tl.set(id, { opacity: 0, y: 28 }, t)
    .to(id, { opacity: 1, y: 0, duration: 0.65, ease: "sine.out" }, t)
    .to(id + " .sh", { opacity: 1, duration: 0.38 }, t + 0.08)
    .to(id + " .s-bar", { width: "76px", duration: 0.55, ease: "sine.out" }, t + 0.26)
    .to(id, { opacity: 0, y: -20, duration: 0.55, ease: "sine.in" }, t + dur);
}

function setLabel(tl, t, txt) {
  tl.call(
    () => {
      document.getElementById("slabel").textContent = txt;
    },
    [],
    t
  );
}

/* =====================================================================
   MAIN TIMELINE
===================================================================== */
const SPEED = 1.5,
  TOTAL = 44;
let masterTL;

function play() {
  if (masterTL) masterTL.kill();

  // Reset all elements
  gsap.set(".tt-slice", { xPercent: (i) => (i % 2 === 0 ? -100 : 100) });
  gsap.set("#welcome,#outro", { opacity: 0 });
  gsap.set(".slide", { opacity: 0 });
  gsap.set(".sh", { opacity: 0 });
  gsap.set(".s-bar", { width: 0 });
  gsap.set(".brand-box", { opacity: 0 });
  gsap.set(".ev-p", { opacity: 0, y: -36 });
  gsap.set(".fil-card", { opacity: 0, scale: 0.86, y: 16 });
  gsap.set(".club-card", { opacity: 0, y: 28 });
  gsap.set(".ai-feat", { opacity: 0 });
  gsap.set("#ai-intro", { opacity: 0 });
  gsap.set(".sd-cell", { opacity: 0 });
  gsap.set(".sd-bar-fill", { width: "0%" });
  gsap.set(".id-badge", { opacity: 0, scale: 0.9, y: 18 });
  gsap.set(".id-sub,.id-desc", { opacity: 0 });
  gsap.set(".ctr-num", { opacity: 0, filter: "blur(8px)" });
  gsap.set(".ctr-plus,.ctr-lbl", { opacity: 0 });
  gsap.set("#o-year,#o-info,#o-tag,#o-cta", { opacity: 0 });
  gsap.set("#o-rule", { width: 0 });

  gsap.set(".br-corner", { opacity: 0 });
  gsap.set("#slabel", { opacity: 0 });
  gsap.set("#replay", { opacity: 0, pointerEvents: "none" });
  gsap.set("#prog-fill", { width: "0%" });
  gsap.set(".w-pre,.w-year,.w-sub", { opacity: 0 });
  gsap.set(".w-innov", { opacity: 0, y: -55 });
  gsap.set(".w-apos", { opacity: 0, y: -30 });
  gsap.set(".w-ind", { opacity: 0, y: 42 });
  gsap.set("#boot", { opacity: 1, display: "flex" });
  gsap.set(".b-line,#b-pct", { opacity: 0 });
  gsap.set("#b-bar", { width: "0%" });

  masterTL = gsap.timeline({ timeScale: SPEED });

  /* progress bar */
  masterTL.to("#prog-fill", { width: "100%", duration: TOTAL, ease: "none" }, 0);

  /* ==== BOOT ==== */
  masterTL
    .to("#bl1", { opacity: 1, duration: 0.3 }, 0.2)
    .to("#bl2", { opacity: 1, duration: 0.3 }, 0.65)
    .to("#b-pct", { opacity: 1, duration: 0.2 }, 0.9)
    .to(
      "#b-bar",
      {
        width: "100%",
        duration: 2.3,
        ease: "sine.inOut",
        onUpdate: function () {
          const el = document.getElementById("b-pct");
          if (el) el.textContent = Math.round(this.progress() * 100) + "%";
        }
      },
      0.9
    )
    .to("#bl3", { opacity: 1, duration: 0.35 }, 3.1)
    .to("#boot", { opacity: 0, duration: 0.5, ease: "sine.in" }, 3.9)
    .set("#boot", { display: "none" }, 4.35);

  masterTL.to(".br-corner", { opacity: 0.55, duration: 0.3, stagger: 0.07 }, 4.35);

  /* ==== WELCOME ==== */
  masterTL
    .to("#welcome", { opacity: 1, duration: 0.01 }, 4.5)
    .to(".w-pre", { opacity: 1, duration: 0.5, ease: "sine.out" }, 4.7)
    .to(".w-innov", { opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.6)" }, 5.45)
    .to(".w-apos", { opacity: 1, y: 0, duration: 0.38, ease: "back.out(2.2)" }, 5.82)
    .call(
      () => {
        flashFx();
        burst(innerWidth / 2, innerHeight / 2, 24, ["#FF5500", "#FFAA00"]);
      },
      [],
      5.88
    )
    .to(".w-ind", { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, 6.12)
    .to(".w-year", { opacity: 1, duration: 0.5 }, 6.75)
    .to(".w-sub", { opacity: 1, duration: 0.5 }, 7.15)
    .to("#welcome", { opacity: 0, scale: 0.96, duration: 0.55, ease: "sine.in" }, 8.6);

  /* ==== S01 ==== */
  slideTransition(masterTL, 9.05);
  setLabel(masterTL, 9.9, "01 / 08");
  masterTL.to("#slabel", { opacity: 1, duration: 0.3 }, 9.9);
  showSlide("#s01", masterTL, 10.0, 3.2);
  masterTL.to(".brand-box", { opacity: 1, duration: 0.55, ease: "sine.out" }, 10.4);

  /* ==== S02 ==== */
  slideTransition(masterTL, 13.2);
  setLabel(masterTL, 13.9, "02 / 08");
  showSlide("#s02", masterTL, 14.0, 3.0);
  masterTL.to(".ev-p", { opacity: 1, y: 0, duration: 0.55, stagger: { each: 0.14 }, ease: "back.out(1.3)" }, 14.5);

  /* ==== S03 ==== */
  slideTransition(masterTL, 17.0);
  setLabel(masterTL, 17.7, "03 / 08");
  showSlide("#s03", masterTL, 17.8, 2.9);
  masterTL.to(".fil-card", { opacity: 1, scale: 1, y: 0, duration: 0.48, stagger: { each: 0.1 }, ease: "back.out(1.5)" }, 18.2);

  /* ==== S04 ==== */
  slideTransition(masterTL, 20.7);
  setLabel(masterTL, 21.4, "04 / 08");
  showSlide("#s04", masterTL, 21.5, 2.9);
  masterTL.to(".club-card", { opacity: 1, y: 0, duration: 0.52, stagger: 0.13, ease: "back.out(1.3)" }, 21.9);

  /* ==== S05 ==== */
  slideTransition(masterTL, 24.4);
  setLabel(masterTL, 25.1, "05 / 08");
  showSlide("#s05", masterTL, 25.2, 2.6);
  masterTL
    .to(".ctr-num", { opacity: 1, filter: "blur(0px)", duration: 0.85, ease: "expo.out" }, 25.6)
    .to(".ctr-plus", { opacity: 0.75, duration: 0.4 }, 25.65)
    .to(".ctr-lbl", { opacity: 1, duration: 0.45 }, 25.95);

  /* ==== S06 ==== */
  slideTransition(masterTL, 27.8);
  setLabel(masterTL, 28.5, "06 / 08");
  showSlide("#s06", masterTL, 28.6, 3.1);
  masterTL
    .to(".id-badge", { opacity: 1, scale: 1, y: 0, duration: 0.68, ease: "back.out(1.5)" }, 29.0)
    .call(
      () => {
        burst(innerWidth / 2, innerHeight / 2 + 20, 32, ["#FF5500", "#FFAA00", "#FF7700"]);
      },
      [],
      29.08
    )
    .to(".id-sub", { opacity: 1, duration: 0.4 }, 29.45)
    .to(".id-desc", { opacity: 1, duration: 0.4 }, 29.75);

  /* ==== S07 ==== */
  slideTransition(masterTL, 31.7);
  setLabel(masterTL, 32.4, "07 / 08");
  showSlide("#s07", masterTL, 32.5, 3.8);
  masterTL
    .to("#ai-intro", { opacity: 1, duration: 0.4 }, 32.9)
    .to(".ai-feat", { opacity: 1, duration: 0.35, stagger: { amount: 0.5, grid: "auto", from: "start" }, ease: "sine.out" }, 33.1);

  /* ==== S08 ==== */
  slideTransition(masterTL, 36.3);
  setLabel(masterTL, 37.0, "08 / 08");
  showSlide("#s08", masterTL, 37.1, 3.2);
  masterTL
    .to(".sd-cell", { opacity: 1, duration: 0.4, stagger: 0.09, ease: "sine.out" }, 37.5)
    .call(
      () => {
        document.querySelectorAll(".sd-cell").forEach((c) => c.classList.add("revealed"));
        document.querySelectorAll(".sd-bar-fill").forEach((b) => {
          b.style.width = "100%";
        });
      },
      [],
      37.7
    );

  masterTL.to("#slabel", { opacity: 0, duration: 0.3 }, 40.2);

  /* ==== OUTRO ==== */
  slideTransition(masterTL, 40.4);
  masterTL
    .to("#outro", { opacity: 1, duration: 0.01 }, 41.2)
    .from("#outro", { scale: 0.92, duration: 0.85, ease: "sine.out" }, 41.2)
    .to("#o-year", { opacity: 1, duration: 0.5 }, 41.8)
    .to("#o-rule", { width: "160px", duration: 0.6, ease: "sine.out" }, 42.2)
    .to("#o-info", { opacity: 1, duration: 0.5 }, 42.6)
    .to("#o-tag", { opacity: 1, duration: 0.5 }, 43.0)
    .to("#o-cta", { opacity: 1, duration: 0.5 }, 43.4)
    .to("#replay", { opacity: 1, duration: 0.45, pointerEvents: "auto" }, 43.9);

  // Notify parent (Next.js overlay) that the animation completed.
  masterTL.eventCallback("onComplete", () => {
    try {
      window.parent.postMessage({ type: "homeIntroDone" }, "*");
    } catch (e) {
      // no-op
    }
  });
}

window.addEventListener("load", () => setTimeout(play, 120));
document.getElementById("replay").addEventListener("click", play);

