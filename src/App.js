import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { Line, Bar, Pie, Radar, PolarArea, Scatter, Bubble, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [bubbleData, setBubbleData] = useState(null); // バブルチャート用のデータ
  const [stackedBarData, setStackedBarData] = useState(null); // 積み上げ棒グラフ用のデータ
  const [radarData, setRadarData] = useState(null); // レーダーチャート用データ
  const [polarData, setPolarData] = useState(null); // ポーラエリアチャート用データ

  const handleCSVData = (csvData) => {
    setData(csvData);

    const labels = csvData.slice(1).map(row => row[0]); // 1列目をラベルとして使用
    const values = csvData.slice(1).map(row => parseFloat(row[1])); // 2列目を数値データとして使用

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'CSV Data',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        }
      ]
    });

    // 散布図のデータ（2列目と3列目のデータを使用）
    setScatterData({
      datasets: [
        {
          label: 'Scatter Plot Data',
          data: csvData.slice(1).map(row => ({ x: parseFloat(row[1]), y: parseFloat(row[2]) })),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 5,
        }
      ]
    });

    // バブルチャート用のデータ（3つの値が必要）
    setBubbleData({
      datasets: [
        {
          label: 'Bubble Chart Data',
          data: csvData.slice(1).map(row => ({
            x: parseFloat(row[1]),
            y: parseFloat(row[2]),
            r: parseFloat(row[3]) // バブルのサイズを表す
          })),
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
        }
      ]
    });

    // 積み上げ棒グラフ用データ
    setStackedBarData({
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: csvData.slice(1).map(row => parseFloat(row[1])),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Dataset 2',
          data: csvData.slice(1).map(row => parseFloat(row[2])),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }
      ]
    });
    // レーダーチャート用データ
    setRadarData({
      labels: labels,
      datasets: [
        {
          label: 'Radar Chart Data',
          data: values,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
        }
      ]
    });

    // ポーラエリアチャート用データ
    setPolarData({
      labels: labels,
      datasets: [
        {
          label: 'Polar Area Chart Data',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ]
        }
      ]
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>CSV Import and Visualization</h1>

      {/* CSVリーダー */}
      <CSVReader
        onFileLoaded={handleCSVData}
        inputStyle={{ color: 'red' }}
      />

      {/* CSVデータを可視化 */}
      {chartData && (
        <div className="chart-container">
          <div className="chart-item">
            <h2>Line Chart</h2>
            <Line data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Bar Chart</h2>
            <Bar data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Scatter Plot</h2>
            {scatterData && <Scatter data={scatterData} />}
          </div>

          <div className="chart-item">
            <h2>Pie Chart</h2>
            <Pie data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Radar Chart</h2>
            <Radar data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Polar Area Chart</h2>
            <PolarArea data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Bubble Chart</h2>
            {bubbleData && <Bubble data={bubbleData} />}
          </div>

          <div className="chart-item">
            <h2>Doughnut Chart</h2>
            <Doughnut data={chartData} />
          </div>

          <div className="chart-item">
            <h2>Stacked Bar Chart</h2>
            {stackedBarData && (
              <Bar
                data={stackedBarData}
                options={{
                  plugins: {
                    legend: { display: true },
                  },
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
