import {
  Chart,
  registerables,
} from "https://cdn.jsdelivr.net/npm/chart.js/+esm";
Chart.register(...registerables);

// then use it normally
// const ctx = document.getElementById("myChart");
const chartbox = document.querySelector(".chart-box");
const ctx = document.createElement("canvas");
ctx.id = "myChart";

let chartInstance = null;
function renderChart(stats, link) {
  const newData = [stats.harmless, stats.malicious, stats.suspicious];
  if (chartInstance) {
    chartInstance.data.datasets.data = newData;
    chartInstance.update();
    return;
  }
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Harmless", "Malicious", "Suspicious"],
      datasets: [
        {
          label: link,
          data: newData,
          borderColor: "#00d4ff",
          backgroundColor: "rgba(0, 212, 255, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "URL Security Analysis" },
      },
    },
  });
  chartbox.appendChild(ctx);
}

export default renderChart;
