const bgEl = document.getElementById("bg");
const pageEl = document.getElementById("page");
const tipEl = document.getElementById("tip");
const wallpaperEl = document.getElementById("wallpaper");
const cardEl = document.getElementById("card");
const toastEl = document.getElementById("toast");

const themes = [
  { bg: "#fbfbfa", a1: "rgba(47,111,235,0.11)", a2: "rgba(255,77,141,0.10)", a3: "rgba(18,185,129,0.10)" },
  { bg: "#fbfaf6", a1: "rgba(244,63,94,0.10)", a2: "rgba(245,158,11,0.12)", a3: "rgba(34,197,94,0.09)" },
  { bg: "#f7fbff", a1: "rgba(59,130,246,0.12)", a2: "rgba(99,102,241,0.10)", a3: "rgba(20,184,166,0.10)" },
  { bg: "#fcf7ff", a1: "rgba(168,85,247,0.12)", a2: "rgba(236,72,153,0.10)", a3: "rgba(99,102,241,0.10)" },
  { bg: "#f6fbf7", a1: "rgba(16,185,129,0.12)", a2: "rgba(34,197,94,0.11)", a3: "rgba(245,158,11,0.10)" },
];

let lastThemeIdx = -1;
let toastTimer = null;
let wallpaperModeIdx = 0;

const wallpaperModes = [
  { id: "sparse", label: "稀疏散落" },
  { id: "corners", label: "角落偷看" },
  { id: "diagonal", label: "對角線隊列" },
  { id: "dam", label: "小水壩紋理" },
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pickTheme() {
  if (themes.length <= 1) return themes[0];
  let idx = Math.floor(Math.random() * themes.length);
  if (idx === lastThemeIdx) idx = (idx + 1) % themes.length;
  lastThemeIdx = idx;
  return themes[idx];
}

function setBackgroundTheme(theme) {
  document.documentElement.style.setProperty("--bg", theme.bg);
  bgEl.style.background = `
    radial-gradient(1200px 800px at 18% 18%, ${theme.a1}, transparent 60%),
    radial-gradient(1100px 700px at 82% 22%, ${theme.a2}, transparent 62%),
    radial-gradient(900px 700px at 60% 86%, ${theme.a3}, transparent 58%),
    linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.15)),
    ${theme.bg}
  `;
}

function spawnStickers(x, y) {
  const count = Math.floor(rand(14, 22));
  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.className = "sticker";
    img.alt = "";
    img.src = "./assets/beaver.png";

    const size = rand(22, 52);
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    const dx = `${rand(-220, 220).toFixed(1)}px`;
    const dy = `${rand(-280, -70).toFixed(1)}px`;
    const r = `${rand(-28, 28).toFixed(1)}deg`;
    img.style.setProperty("--dx", dx);
    img.style.setProperty("--dy", dy);
    img.style.setProperty("--r", r);
    img.style.animationDuration = `${rand(760, 1120).toFixed(0)}ms`;
    img.style.animationDelay = `${rand(0, 120).toFixed(0)}ms`;

    document.body.appendChild(img);

    const removeAfter = 1600;
    window.setTimeout(() => img.remove(), removeAfter);
  }
}

function clearWallpaper() {
  if (!wallpaperEl) return;
  wallpaperEl.innerHTML = "";
}

function setWallpaperMode(modeId) {
  if (!wallpaperEl) return;
  wallpaperEl.classList.toggle("isDam", modeId === "dam");
  wallpaperEl.dataset.mode = modeId;
}

function addWallpaperBeaver({ xPct, yPct, rDeg, s, o, size }) {
  if (!wallpaperEl) return;
  const img = document.createElement("img");
  img.className = "wBeaver";
  img.alt = "";
  img.src = "./assets/beaver.png";
  img.draggable = false;

  img.style.left = `${xPct}%`;
  img.style.top = `${yPct}%`;
  img.style.setProperty("--r", `${rDeg.toFixed(1)}deg`);
  img.style.setProperty("--s", s.toFixed(2));
  img.style.setProperty("--o", o.toFixed(2));
  img.style.width = `${size.toFixed(1)}px`;
  img.style.height = `${size.toFixed(1)}px`;

  wallpaperEl.appendChild(img);
}

function generateWallpaper(modeId = "sparse") {
  if (!wallpaperEl) return;
  clearWallpaper();
  setWallpaperMode(modeId);

  if (modeId === "sparse") {
    const count = Math.floor(rand(16, 26));
    for (let i = 0; i < count; i++) {
      addWallpaperBeaver({
        xPct: rand(6, 94),
        yPct: rand(6, 94),
        rDeg: rand(-18, 18),
        s: rand(0.62, 1.02),
        o: rand(0.06, 0.13),
        size: rand(22, 34),
      });
    }
    return;
  }

  if (modeId === "corners") {
    const corners = [
      { x: 12, y: 14 },
      { x: 88, y: 14 },
      { x: 12, y: 88 },
      { x: 88, y: 88 },
    ];
    for (const c of corners) {
      const n = Math.floor(rand(2, 4));
      for (let i = 0; i < n; i++) {
        addWallpaperBeaver({
          xPct: clamp(c.x + rand(-7, 7), 5, 95),
          yPct: clamp(c.y + rand(-7, 7), 5, 95),
          rDeg: rand(-16, 16),
          s: rand(0.62, 0.95),
          o: rand(0.07, 0.14),
          size: rand(22, 34),
        });
      }
    }
    // A few very faint extras to avoid emptiness
    const extras = Math.floor(rand(4, 7));
    for (let i = 0; i < extras; i++) {
      addWallpaperBeaver({
        xPct: rand(8, 92),
        yPct: rand(10, 90),
        rDeg: rand(-18, 18),
        s: rand(0.60, 0.92),
        o: rand(0.03, 0.07),
        size: rand(20, 30),
      });
    }
    return;
  }

  if (modeId === "diagonal") {
    // Place beavers along subtle diagonal "lanes"
    const lanes = Math.floor(rand(3, 5));
    for (let lane = 0; lane < lanes; lane++) {
      const offset = rand(-18, 18) + lane * rand(10, 16);
      const n = Math.floor(rand(6, 9));
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = 10 + t * 80;
        const y = 18 + t * 70 + offset;
        addWallpaperBeaver({
          xPct: clamp(x + rand(-2.6, 2.6), 5, 95),
          yPct: clamp(y + rand(-2.6, 2.6), 5, 95),
          rDeg: rand(-10, 10),
          s: rand(0.58, 0.86),
          o: rand(0.05, 0.11),
          size: rand(20, 32),
        });
      }
    }
    return;
  }

  // dam
  const count = Math.floor(rand(12, 18));
  for (let i = 0; i < count; i++) {
    addWallpaperBeaver({
      xPct: rand(7, 93),
      yPct: rand(7, 93),
      rDeg: rand(-14, 14),
      s: rand(0.55, 0.90),
      o: rand(0.05, 0.12),
      size: rand(18, 30),
    });
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function showToast(message) {
  if (!toastEl) return;
  // Place toast near the card for visibility on large screens.
  if (cardEl) {
    const rect = cardEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height + 14; // slightly under card
    document.documentElement.style.setProperty("--tx", `${x}px`);
    document.documentElement.style.setProperty("--ty", `${y}px`);
  }
  toastEl.textContent = message;
  toastEl.classList.add("isShow");
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("isShow"), 1200);
}

function isInsideCard(target) {
  const card = document.querySelector(".card");
  return card?.contains(target);
}

function setTip(text) {
  if (!tipEl) return;
  tipEl.textContent = text;
}

// Buttons: demo "link" color change without leaving page.
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const kind = btn.dataset.kind;

    const payloadMap = {
      ig: "IG：@your_handle (demo)",
      email: "Email：you@example.com (demo)",
      github: "GitHub：github.com/yourname (demo)",
    };

    const ok = await copyText(payloadMap[kind] ?? "demo");
    btn.classList.add("isDone");
    window.setTimeout(() => btn.classList.remove("isDone"), 750);
    showToast(ok ? "已複製" : "已觸發互動");
  });
});

// Background surprise: click to change theme + dam texture + beaver burst.
bgEl.addEventListener("click", (e) => {
  // Avoid accidental triggers if user clicks UI; the bg is behind, but just in case.
  if (isInsideCard(e.target)) return;

  const theme = pickTheme();
  setBackgroundTheme(theme);
  wallpaperModeIdx = (wallpaperModeIdx + 1) % wallpaperModes.length;
  const mode = wallpaperModes[wallpaperModeIdx];
  generateWallpaper(mode.id);
  spawnStickers(e.clientX, e.clientY);
  setTip("點背景切換河狸壁紙；點名片有小驚喜。");
});

// Also allow clicking anywhere outside the card (mobile friendly).
pageEl.addEventListener("click", (e) => {
  if (isInsideCard(e.target)) return;
  const theme = pickTheme();
  setBackgroundTheme(theme);
  wallpaperModeIdx = (wallpaperModeIdx + 1) % wallpaperModes.length;
  const mode = wallpaperModes[wallpaperModeIdx];
  generateWallpaper(mode.id);
  spawnStickers(e.clientX ?? window.innerWidth / 2, e.clientY ?? window.innerHeight / 2);
  setTip("點背景切換河狸壁紙；點名片有小驚喜。");
});

// Card surprise: click to toggle peek + soft gloss.
cardEl?.addEventListener("click", (e) => {
  // Don't treat button clicks as card toggle
  if (e.target?.closest?.(".btn")) return;
  cardEl.classList.toggle("isSurprise");
  showToast(cardEl.classList.contains("isSurprise") ? "河狸開始跟著你了" : "河狸先躲起來了");
});

// Beaver peeking follows cursor (subtle).
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function updatePeekByEvent(e) {
  if (!cardEl) return;
  const rect = cardEl.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  // Keep inside card padding a bit.
  const x = clamp(px, 26, rect.width - 26);
  const y = clamp(py, 26, rect.height - 26);
  cardEl.style.setProperty("--mx", `${x}px`);
  cardEl.style.setProperty("--my", `${y}px`);
}

window.addEventListener("mousemove", (e) => {
  updatePeekByEvent(e);
});

window.addEventListener("deviceorientation", (e) => {
  if (!cardEl) return;
  // Mobile: gentle motion using tilt.
  const rect = cardEl.getBoundingClientRect();
  const dx = (e.gamma ?? 0) / 45; // left/right
  const dy = (e.beta ?? 0) / 65; // front/back
  const x = rect.width * (0.5 + dx * 0.45);
  const y = rect.height * (0.62 + dy * 0.35);
  cardEl.style.setProperty("--mx", `${clamp(x, 26, rect.width - 26).toFixed(1)}px`);
  cardEl.style.setProperty("--my", `${clamp(y, 26, rect.height - 26).toFixed(1)}px`);
});

// Initialize.
setBackgroundTheme(pickTheme());
// Start from sparse
wallpaperModeIdx = 0;
generateWallpaper(wallpaperModes[wallpaperModeIdx].id);
