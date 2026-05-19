import renderChart from "./chart.js";
import { startTest } from "./InternetSpeed.js";
const global = {
  currentPage: window.location.pathname,
};

startTest().then((mbps) => {
  const toast = document.getElementById("netToast");
  const label = document.getElementById("netMbps");
  if (!toast || !label) return;
  label.textContent = mbps ?? "—";
  setTimeout(() => toast.classList.add("hidden"), 5500);
});

function addColor() {
  const navlinks = document.querySelectorAll(".nav-link");
  navlinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// scan POST and GET

async function fetchAnalysis(id) {
  for (let i = 0; i < 10; i++) {
    const res = await fetch(`/api/analysis.js?id=${id}`);
    const data = await res.json();
    if (data.data?.attributes?.status === "completed") return data;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

function showErrAlert(msg) {
  const div = document.createElement("p");
  // div.className = 'alertContainer'
  div.classList.add("alert");
  div.appendChild(document.createTextNode(msg));
  document.querySelector(".chart-box").appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
async function urlAnalysis() {
  const url = document.querySelector(".search-input").value;
  if (url === "") {
    showErrAlert("Opps!! You need to Enter URL");
  } else {
    if (url !== "") {
      try {
        addSpinner();
        const analysisRes = await fetch("/api/scanUrl.js", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ url }),
        });
        console.log("scan status:", analysisRes);
        const analysisId = await analysisRes.json();
        console.log("scan response:", analysisId);

        if (analysisId.error) {
          showErrAlert("Looks like the Url is invalid, try again");
          removeSpinner();
          return;
        }

        const data = await fetchAnalysis(analysisId.data.id);
        removeSpinner();
        if (!data) {
          showErrAlert("Scan timed out, please try again");
          return;
        }
        renderChart(data.data.attributes.stats, url);
        console.log("analysis result:", data);
        const malicious = data.data.attributes.stats.malicious;
        const suspicious = data.data.attributes.stats.suspicious;
        const harmless = data.data.attributes.stats.harmless;
        conclusion(malicious, suspicious, harmless);
      } catch (err) {
        console.error("fetch error:", err);
        if (err.response === "Unable to canonicalize url") {
          showErrAlert("Enter a valid Url");
        }
      }
    }
  }
  document.querySelector(".search-input").value = "";
}
function clicker(e) {
  if (e.key === "Enter") {
    urlAnalysis();
  }
}
function init() {
  addColor();

  const scanBtn = document.querySelector(".btn-scan");
  if (scanBtn) scanBtn.addEventListener("click", urlAnalysis);
  document.querySelector(".search-input").addEventListener("keydown", clicker);
}
function addSpinner() {
  document.querySelector(".loader").classList.remove("show");
  const scanBtn = document.querySelector(".btn-scan");
  scanBtn.disabled = true;
}
function removeSpinner() {
  document.querySelector(".loader").classList.add("show");
  const scanBtn = document.querySelector(".btn-scan");
  scanBtn.disabled = false;
}

function conclusion(malicious, suspicious, harmless) {
  const isUnsafe = malicious > 0;
  const isSuspicious = !isUnsafe && suspicious > 0;

  const statusText = isUnsafe ? "Unsafe" : isSuspicious ? "Suspicious" : "Safe";
  const statusColor = isUnsafe
    ? "#ef4444"
    : isSuspicious
      ? "#f59e0b"
      : "#00d4ff";
  const dotColor = statusColor;

  const verdict = isUnsafe
    ? "This URL has been flagged as malicious. Avoid visiting this site — it may attempt to steal data or install harmful software."
    : isSuspicious
      ? "This URL shows suspicious patterns. Proceed with caution and avoid entering any personal information."
      : "This URL appears clean. No malicious or suspicious signals were detected across all security engines.";

  document.querySelector(".conclusion-section").innerHTML = `
    <div class="conclusion-card">

      <div class="conclusion-top">
        <div class="conclusion-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span class="conclusion-label">Security Analysis</span>
        <span class="conclusion-live">
          <span class="conclusion-live-dot"></span>Live
        </span>
      </div>

      <p class="conclusion-text">${verdict}</p>

      <div class="conclusion-bottom">
        <div class="conclusion-stat">
          <span class="conclusion-stat-val" style="color:${statusColor}">${statusText}</span>
        </div>
        <span class="conclusion-divider-v"></span>
        <span class="conclusion-stat-detail"><span style="color:#ef4444">${malicious}</span> malicious</span>
        <span class="conclusion-divider-v"></span>
        <span class="conclusion-stat-detail"><span style="color:#f59e0b">${suspicious}</span> suspicious</span>
        <span class="conclusion-divider-v"></span>
        <span class="conclusion-stat-detail"><span style="color:#22c55e">${harmless}</span> clean</span>
      </div>

    </div>
  `;
}

export { urlAnalysis, init };
