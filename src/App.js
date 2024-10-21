import React, { useState } from 'react';
import { Line, Bar, Pie, Radar, PolarArea, Scatter, Bubble, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadarController, BubbleController, PolarAreaController, RadialLinearScale } from 'chart.js';
import * as XLSX from 'xlsx';
import './App.css';

// 必要なスケールやコントローラーを登録
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  BubbleController,
  PolarAreaController,
  RadialLinearScale // ここで radialLinear スケールを登録
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line'); // Set default chart type

  const handleExcelData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      setWorkbook(workbook);
      setSheetNames(workbook.SheetNames);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSheetSelection = (sheetName) => {
    setSelectedSheet(sheetName);

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const labels = jsonData[0];
    const data = jsonData.slice(1).map((row) => ({
      x: row[0],
      y: row[1],
    }));

    setChartData({
      labels: labels.slice(1),
      datasets: [
        {
          label: 'Chart Data',
          data: jsonData.slice(1).map(row => row[1]),
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} />;
      case 'bar':
        return <Bar data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      case 'radar':
        return <Radar data={chartData} />;
      case 'polarArea':
        return <PolarArea data={chartData} />;
      case 'scatter':
        return <Scatter data={chartData} />;
      case 'bubble':
        return <Bubble data={chartData} />;
      case 'doughnut':
        return <Doughnut data={chartData} />;
      default:
        return null;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const envId = process.env.REACT_APP_ID;
    const envPassword = process.env.REACT_APP_PASSWORD;

    if (inputId === envId && inputPassword === envPassword) {
      setIsLoggedIn(true);
    } else {
      alert('IDまたはパスワードが間違っています。');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h2>ログイン</h2>
        <form onSubmit={handleLogin} className="form">
          <div className="formGroup">
            <label htmlFor="id">ID: </label>
            <input
              type="text"
              id="id"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">パスワード: </label>
            <input
              type="password"
              id="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">ログイン</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>XLSX Import and Visualization</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleExcelData} />

      {sheetNames.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="sheet-select">Select Sheet: </label>
          <select
            id="sheet-select"
            value={selectedSheet}
            onChange={(e) => handleSheetSelection(e.target.value)}
          >
            {sheetNames.map(sheetName => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
      )}

      {chartData && (
        <div>
          <h2>Chart Visualization</h2>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{ marginBottom: '20px' }}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="radar">Radar</option>
            <option value="polarArea">Polar Area</option>
            <option value="scatter">Scatter</option>
            <option value="bubble">Bubble</option>
            <option value="doughnut">Doughnut</option>
          </select>

          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default App;
