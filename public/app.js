let global = {
  network: {
    testing: false,
  },
  currentPage: window.location.pathname,
};

export async function startTest() {
  if (global.network.testing) return;
  global.network.testing = true;

  const btn = document.getElementById("startBtn");
  const speedVal = document.getElementById("speedValue");
  const statusTxt = document.getElementById("statusText");
  const ringFill = document.getElementById("ringFill");
  const pingVal = document.getElementById("pingVal");
  const dlVal = document.getElementById("downloadVal");
  const statusVal = document.getElementById("statusVal");

  // Reset UI
  speedVal.textContent = "0";
  statusTxt.textContent = "Testing…";
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> Testing`;
  setRing(0);

  // ── Ping test ────────────────────────────────────────────
  const pingStart = performance.now();
  try {
    await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
      mode: "no-cors",
    });
  } catch (_) {}
  const ping = Math.round(performance.now() - pingStart);
  pingVal.textContent = ping + " ms";

  // ── Download speed test ──────────────────────────────────
  // Fetch a ~5 MB public file and measure throughput
  const testUrl = "https://speed.cloudflare.com/__down?bytes=5000000";
  const dlStart = performance.now();
  let bytes = 0;

  try {
    const res = await fetch(testUrl + "&_=" + Date.now(), {
      cache: "no-store",
    });
    const reader = res.body.getReader();
    const total = 5_000_000;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;

      // Live speed update
      const elapsed = (performance.now() - dlStart) / 1000;
      const mbps = ((bytes * 8) / elapsed / 1_000_000).toFixed(1);
      speedVal.textContent = mbps;
      setRing(Math.min(bytes / total, 1));
    }
  } catch (err) {
    statusTxt.textContent = "Test failed – check connection";
    resetBtn();
    global.network.testing = false;
    return;
  }

  const elapsed = (performance.now() - dlStart) / 1000;
  const finalMbps = ((bytes * 8) / elapsed / 1_000_000).toFixed(1);

  // ── Final display ────────────────────────────────────────
  speedVal.textContent = finalMbps;
  statusTxt.textContent = "Test complete";
  dlVal.textContent = finalMbps + " Mbps";
  statusVal.textContent =
    finalMbps > 25 ? "✓ Good" : finalMbps > 5 ? "~ Fair" : "✗ Slow";
  statusVal.style.color =
    finalMbps > 25 ? "#00d4ff" : finalMbps > 5 ? "#f59e0b" : "#ef4444";

  setRing(1);
  resetBtn();
  global.network.testing = false;
}

function setRing(pct) {
  const ring = document.getElementById("ringFill");
  const circ = 2 * Math.PI * 52; // r=52
  ring.style.strokeDashoffset = circ - pct * circ;
}

function resetBtn() {
  const btn = document.getElementById("startBtn");
  btn.disabled = false;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Retest`;
}

function init() {
  addColor();
  const startBtn = document.querySelector("#startBtn");
  if (startBtn) startBtn.addEventListener("click", startTest);
  const scanBtn = document.querySelector(".btn-scan");
  if (scanBtn) scanBtn.addEventListener("click", urlAnalysis);
}

function addColor() {
  const navlinks = document.querySelectorAll(".nav-link");
  navlinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", init);

// scan POST and GET

async function urlAnalysis() {
  const url = document.querySelector(".search-input").value;

  try {
    const analysisRes = await fetch("/api/scanUrl.js", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    console.log("scan status:", analysisRes.status);
    const analysisId = await analysisRes.json();
    console.log("scan response:", analysisId);

    const res = await fetch(`/api/analysis.js?id=${analysisId.data.id}`);
    console.log("analysis status:", res.status);
    const data = await res.json();
    console.log("analysis result:", data);
  } catch (err) {
    console.error("fetch error:", err);
  }
}

document.querySelector(".search-input").addEventListener("input", clicker);

function clicker(e) {
  if (e.key === "Enter") {
    urlAnalysis();
  }
}
