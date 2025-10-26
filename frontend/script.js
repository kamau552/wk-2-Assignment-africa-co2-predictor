/* script.js
   Frontend: posts to POST /predict { country: "Kenya" } or model inputs,
   receives { predicted_emission, historical: [...rows...] } and draws charts.
*/

const API_BASE = "http://127.0.0.1:8000"; // change if needed

// Countries (matches your CSV)
const countries = ["Kenya","Nigeria","South Africa","Egypt","Ethiopia","Ghana"];

// DOM refs
const countrySelect = document.getElementById("countrySelect");
const fetchBtn = document.getElementById("fetchBtn");
const predictedVal = document.getElementById("predictedVal");
const lastYearVal = document.getElementById("lastYearVal");
const changeVal = document.getElementById("changeVal");
const trendVal = document.getElementById("trendVal");
const trackTemp = document.getElementById("trackTemp");
const trackEnergy = document.getElementById("trackEnergy");
const trackGDP = document.getElementById("trackGDP");
const trackPop = document.getElementById("trackPop");
const dataTableBody = document.querySelector("#dataTable tbody");
const customForm = document.getElementById("customForm");
const customResult = document.getElementById("customResult");
const modeToggle = document.getElementById("modeToggle");

// Chart instances
let lineChart = null;
let barChart = null;

// Fill country selector
function populateCountries(){
  countrySelect.innerHTML = "";
  countries.forEach(c => {
    const o = document.createElement("option"); 
    o.value = c; 
    o.textContent = c;
    countrySelect.appendChild(o);
  });
}

// Fetch prediction data for a country
async function postPredictForCountry(country) {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: country })
    });
    
    const data = await res.json();
    
    if (data.error) {
      alert("Error: " + data.error);
      return null;
    }
    
    return data;
  } catch(error) {
    console.error("Fetch error:", error);
    alert("Failed to connect to the API. Make sure the backend is running.");
    return null;
  }
}

// Update UI and charts given response
function updateUIFromResponse(country, resp){
  if(!resp) return;
  if(resp.error){
    predictedVal.textContent = "Error";
    trendVal.textContent = resp.error;
    return;
  }

  // Update prediction display
  predictedVal.textContent = resp.predicted_emission != null ? resp.predicted_emission.toFixed(3) : "—";
  lastYearVal.textContent = resp.last_year_emission != null ? resp.last_year_emission.toFixed(3) : "—";
  changeVal.textContent = resp.change_percent != null ? `${resp.change_percent}%` : "—";
  trendVal.textContent = resp.trend ?? "—";

  // Parse historical data
  const hist = (resp.historical || resp.history || []).map(r => ({
    Year: r.Year ?? r.year,
    CO2: r.CO2_Emissions ?? r.CO2 ?? r.co2 ?? r.value,
    Temp: r.Avg_Temperature ?? r.Temp ?? r.temp,
    Energy: r.Energy_Use ?? r.Energy ?? r.energy,
    GDP: r.GDP ?? r.gdp,
    Pop: r.Population ?? r.population ?? r.Pop
  }));

  // Fill tracker from last historical row
  if(hist.length){
    const last = hist[hist.length-1];
    trackTemp.textContent = last.Temp != null ? last.Temp.toFixed(1) : "—";
    trackEnergy.textContent = last.Energy != null ? last.Energy : "—";
    trackGDP.textContent = last.GDP != null ? last.GDP.toFixed(1) : "—";
    trackPop.textContent = last.Pop != null ? last.Pop.toFixed(1) : "—";
  } else {
    trackTemp.textContent = trackEnergy.textContent = trackGDP.textContent = trackPop.textContent = "—";
  }

  // Update table and charts
  populateTable(hist, resp.predicted_emission, resp.year);
  renderLineChart(country, hist, resp.predicted_emission, resp.year);
  renderBarChart(hist);
}

// Populate data table
function populateTable(history, predicted, predictedYear){
  dataTableBody.innerHTML = "";
  
  // Add historical rows
  history.forEach(r=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.Year}</td>
      <td>${r.CO2 != null ? r.CO2.toFixed(3) : "—"}</td>
      <td>${r.Temp != null ? r.Temp.toFixed(1) : "—"}</td>
      <td>${r.Energy != null ? r.Energy : "—"}</td>
      <td>${r.GDP != null ? r.GDP.toFixed(1) : "—"}</td>
      <td>${r.Pop != null ? r.Pop.toFixed(1) : "—"}</td>
    `;
    dataTableBody.appendChild(tr);
  });
  
  // Add predicted row
  if(predicted != null && !isNaN(predicted)){
    const tr = document.createElement("tr");
    const futureYear = predictedYear || (history.length ? Math.max(...history.map(h=>h.Year)) + 10 : 2030);
    tr.innerHTML = `
      <td>${futureYear}</td>
      <td style="font-weight:bold; color:#1db6a8;">${Number(predicted).toFixed(3)}</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
    `;
    tr.style.fontStyle = "italic";
    tr.style.backgroundColor = "rgba(29, 182, 168, 0.05)";
    dataTableBody.appendChild(tr);
  }
}

// ✅ IMPROVED: Line chart showing historical + predicted
function renderLineChart(country, history, predicted, predictedYear){
  const ctx = document.getElementById("co2Chart").getContext("2d");
  
  // Historical data
  const histYears = history.map(h => h.Year);
  const histCO2 = history.map(h => h.CO2);
  
  // Add predicted year
  const futureYear = predictedYear || (histYears.length ? Math.max(...histYears) + 10 : 2030);
  
  // Create labels including future year
  const allYears = [...histYears, futureYear];
  
  // Historical dataset (only historical data points)
  const historicalData = histCO2.map((v, i) => v);
  historicalData.push(null); // null for predicted year
  
  // Predicted dataset (only the predicted point)
  const predictedData = new Array(histCO2.length).fill(null);
  predictedData.push(predicted != null ? Number(predicted) : null);
  
  const datasets = [
    {
      label: "Historical CO₂",
      data: historicalData,
      borderColor: "#2b6fd6",
      backgroundColor: "rgba(43, 111, 214, 0.08)",
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: "Predicted CO₂ (2030)",
      data: predictedData,
      borderColor: "#1db6a8",
      backgroundColor: "rgba(29, 182, 168, 0.2)",
      borderDash: [8, 4],
      fill: false,
      pointRadius: 8,
      pointStyle: "rectRounded",
      pointHoverRadius: 10
    }
  ];

  if(lineChart) lineChart.destroy();
  
  lineChart = new Chart(ctx, {
    type: "line",
    data: { labels: allYears, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { 
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: `CO₂ Emissions Trend for ${country}`,
          font: { size: 16, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(3) + ' metric tons';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: { 
          title: { 
            display: true, 
            text: "Year",
            font: { size: 14, weight: 'bold' }
          }
        },
        y: { 
          title: { 
            display: true, 
            text: "CO₂ Emissions (metric tons per capita)",
            font: { size: 14, weight: 'bold' }
          },
          beginAtZero: true
        }
      }
    }
  });
}

// Bar chart: comparison of latest year across countries
function renderBarChart(historicalData){
  const ctx = document.getElementById("barChart").getContext("2d");
  
  // Use default values for all countries (latest 2020 data from CSV)
  const labels = countries;
  const values = [0.42, 0.94, 9.50, 2.78, 0.26, 0.49]; // Kenya, Nigeria, SA, Egypt, Ethiopia, Ghana
  
  if(barChart) barChart.destroy();
  
  barChart = new Chart(ctx, {
    type: "bar",
    data: { 
      labels, 
      datasets: [{ 
        label: "Latest CO₂ Emissions (2020)", 
        data: values, 
        backgroundColor: [
          "#66c2a5", "#fc8d62", "#8da0cb", 
          "#e78ac3", "#a6d854", "#ffd92f"
        ],
        borderColor: "#2c3e50",
        borderWidth: 1
      }] 
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "CO₂ Emissions Comparison (2020)",
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          title: {
            display: true,
            text: "CO₂ Emissions (metric tons)",
            font: { size: 12 }
          }
        }
      }
    }
  });
}

// Handle fetch button click
fetchBtn.addEventListener("click", async ()=>{
  const country = countrySelect.value;
  
  // Show loading state
  predictedVal.textContent = "Loading...";
  trendVal.textContent = "...";
  
  try {
    const resp = await postPredictForCountry(country);
    if(resp) {
      updateUIFromResponse(country, resp);
    }
  } catch(err) {
    console.error("Error:", err);
    predictedVal.textContent = "Error";
    trendVal.textContent = "Failed to load data";
  }
});

// Custom form submission (manual inputs)
customForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  customResult.textContent = "Predicting...";
  
  const payload = {
    Year: Number(document.getElementById("cYear").value),
    Avg_Temperature: Number(document.getElementById("cTemp").value),
    Energy_Use: Number(document.getElementById("cEnergy").value),
    GDP: Number(document.getElementById("cGDP").value),
    Population: Number(document.getElementById("cPop").value),
    Country_Code: Number(document.getElementById("cCode").value)
  };
  
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST", 
      headers: {"Content-Type":"application/json"}, 
      body: JSON.stringify(payload)
    });
    
    const j = await res.json();
    
    if(j.error) {
      customResult.innerHTML = `<span style="color:#c0392b">❌ ${j.error}</span>`;
    } else {
      const prediction = j.Predicted_CO2_Emission ?? j.predicted_emission ?? j.prediction;
      customResult.innerHTML = `✅ Predicted CO₂: <strong style="color:#1db6a8; font-size:1.2em;">${prediction ? prediction.toFixed(3) : "N/A"} metric tons</strong>`;
    }
  } catch(err) {
    customResult.innerHTML = `<span style="color:#c0392b">❌ Request failed. Check if backend is running.</span>`;
    console.error(err);
  }
});

// Theme toggle
modeToggle.addEventListener("change", (e)=>{
  document.body.classList.toggle("dark", e.target.checked);
});

// Initialize on page load
function init(){
  populateCountries();
  countrySelect.value = countries[0];
  
  // Initialize empty charts
  renderBarChart([]);
  
}

// Run initialization
init();