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

async function urlAnalysis() {
  const url = document.querySelector(".search-input").value;

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

      const res = await fetch(`/api/analysis.js?id=${analysisId.data.id}`);
      console.log("analysis status:", res.status);
      removeSpinner();
      const data = await res.json();
      console.log("analysis result:", data);
    } catch (err) {
      console.error("fetch error:", err);
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
}
function removeSpinner() {
  document.querySelector(".loader").classList.add("show");
}

// window.addEventListener("DOMContentLoaded", init);

// function pageManager(path, pageFun) {
//   switch (global.currentPage) {
//     case path:
//       pageFun;
//       break;
//     case path:
//       pageFun;
//       break;
//   }
// }
// console.log(global.currentPage);
export { urlAnalysis, init };
