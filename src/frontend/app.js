import renderChart from "./chart.js";
const global = {
  currentPage: window.location.pathname,
};

function addColor() {
  const navlinks = document.querySelectorAll(".nav-link");
  navlinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// scan POST and GET

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
        console.log("scan status:", analysisRes.status);
        const analysisId = await analysisRes.json();
        console.log("scan response:", analysisId);

        if (analysisId.error) {
          showErrAlert("Looks like the Url is invalid, try again");
          removeSpinner();
          return;
        }

        const res = await fetch(`/api/analysis.js?id=${analysisId.data.id}`);
        console.log("analysis status:", res.status);
        removeSpinner();
        const data = await res.json();
        if (data.error && data.error.code === "InvalidArgumentError") {
          showErrAlert("Looks like the Url is invalid, try again");
          return;
        }
        if (Object.keys(data.data.attributes.results).length === 0) {
          showErrAlert("Looks like the Url is invalid, try again");
          return;
        }
        renderChart(data.data.attributes.stats);
        console.log("analysis result:", data);
      } catch (err) {
        console.error("fetch error:", err);
        // if (err.response === "Unable to canonicalize url") {
        //   showErrAlert("Enter a valid Url");
        // }
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

export { urlAnalysis, init };
