import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

function ChartComponent() {
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;
        setCsvData(data);

        const chartLabels = data.map((entry) => entry.KP);
        const chartData = data.map((entry) => entry.X);

        setChartData({
          x: chartLabels,
          y: chartData,
          type: "scatter",
          mode: "lines+markers",
          line: { color: "rgba(75, 192, 192, 1)" }
        });
      }
    });
  };

  return (
    <div className="App">
      <h1>CSV Upload and Chart</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {chartData && (
        <div style={{ width: "80%", margin: "20px auto" }}>
          <Plot
            data={[chartData]}
            layout={{
              width: 800,
              height: 400,
              xaxis: { title: "KP" },
              yaxis: { title: "X" }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ChartComponent;
