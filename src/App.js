import React, { useState } from 'react';
import { Line, Bar, Pie, Radar, PolarArea, Scatter, Bubble, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadarController, BubbleController, PolarAreaController, RadialLinearScale } from 'chart.js';
import * as XLSX from 'xlsx';
import './App.css';

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
  RadialLinearScale
);

const generateColors = (count) => {
  const baseColors = [
    'rgba(75,192,192,0.4)',
    'rgba(153,102,255,0.4)',
    'rgba(255,159,64,0.4)',
    'rgba(54,162,235,0.4)',
    'rgba(255,99,132,0.4)',
    'rgba(255,206,86,0.4)',
    'rgba(75,192,192,0.4)',
    'rgba(153,102,255,0.4)',
    'rgba(54,162,235,0.4)',
  ];

  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [displayType, setDisplayType] = useState('chart');
  const [chartType, setChartType] = useState('line');
  const [captions, setCaptions] = useState([]);

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
    const resultIndex = jsonData.findIndex(row => row.includes('Result'));

    if (resultIndex !== -1) {
      const captionsRow = jsonData[resultIndex + 1];
      const resultData = jsonData.slice(resultIndex + 1);

      const filteredData = resultData.filter(row => row.some(cell => cell !== undefined));
      setTableData(filteredData);

      const labels = filteredData.map(row => row[0]);
      const dataValues = filteredData.map(row => row.slice(1));

      setCaptions(captionsRow.slice(1));
      const colors = generateColors(captionsRow.length - 1);

      setChartData({
        labels: labels,
        datasets: dataValues[0].map((_, colIndex) => ({
          label: captionsRow[colIndex + 1],
          data: filteredData.map(row => row[colIndex + 1]),
          backgroundColor: colors[colIndex % colors.length],
          borderColor: colors[colIndex % colors.length].replace('0.4', '1'),
          borderWidth: 1,
        }))
      });
    } else {
      alert("Result section not found");
    }
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

  const renderTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            {tableData[0] && tableData[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCaptions = () => {
    return (
      <div className="captions">
        {captions.map((caption, index) => (
          <p key={index} style={{ color: generateColors(captions.length)[index % captions.length] }}>
            {caption}
          </p>
        ))}
      </div>
    );
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

      {tableData.length > 0 && (
        <div>
          <h2>Display Mode</h2>
          <select
            value={displayType}
            onChange={(e) => setDisplayType(e.target.value)}
            style={{ marginBottom: '20px' }}
          >
            <option value="chart">Chart</option>
            <option value="table">Table</option>
          </select>

          {displayType === 'chart' ? (
            <>
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
              {renderCaptions()}
            </>
          ) : (
            <>
              <h2>Table View</h2>
              {renderTable()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
