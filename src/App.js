import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { Line, Bar, Pie, Radar, PolarArea, Scatter, Bubble, Doughnut } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [chartData, setChartData] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');

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
  //   setData(csvData);

  //   const labels = csvData.slice(1).map(row => row[0]);
  //   const values = csvData.slice(1).map(row => parseFloat(row[1]));

  //   setChartData({
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'CSV Data',
  //         data: values,
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)',
  //           'rgba(255, 99, 132, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)',
  //           'rgba(255, 99, 132, 1)'
  //         ],
  //         borderWidth: 1,
  //       }
  //     ]
  //   });

  //   setScatterData({
  //     datasets: [
  //       {
  //         label: 'Scatter Plot Data',
  //         data: csvData.slice(1).map(row => ({ x: parseFloat(row[1]), y: parseFloat(row[2]) })),
  //         backgroundColor: 'rgba(75, 192, 192, 0.5)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         pointRadius: 5,
  //       }
  //     ]
  //   });

  //   setBubbleData({
  //     datasets: [
  //       {
  //         label: 'Bubble Chart Data',
  //         data: csvData.slice(1).map(row => ({
  //           x: parseFloat(row[1]),
  //           y: parseFloat(row[2]),
  //           r: parseFloat(row[3])
  //         })),
  //         backgroundColor: 'rgba(255, 159, 64, 0.5)',
  //         borderColor: 'rgba(255, 159, 64, 1)',
  //       }
  //     ]
  //   });

  //   setStackedBarData({
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Dataset 1',
  //         data: csvData.slice(1).map(row => parseFloat(row[1])),
  //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //       },
  //       {
  //         label: 'Dataset 2',
  //         data: csvData.slice(1).map(row => parseFloat(row[2])),
  //         backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //       }
  //     ]
  //   });

  //   setRadarData({
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Radar Chart Data',
  //         data: values,
  //         backgroundColor: 'rgba(153, 102, 255, 0.5)',
  //         borderColor: 'rgba(153, 102, 255, 1)',
  //         borderWidth: 2,
  //       }
  //     ]
  //   });

  //   setPolarData({
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Polar Area Chart Data',
  //         data: values,
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.5)',
  //           'rgba(54, 162, 235, 0.5)',
  //           'rgba(255, 206, 86, 0.5)',
  //           'rgba(75, 192, 192, 0.5)',
  //           'rgba(153, 102, 255, 0.5)',
  //           'rgba(255, 159, 64, 0.5)'
  //         ]
  //       }
  //     ]
  //   });
  // };

  const handleSheetSelection = (sheetName) => {
    setSelectedSheet(sheetName);

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const labels = jsonData.map(row => row['Label']); // ラベルを設定
    const values = jsonData.map(row => parseFloat(row['Value'])); // 値を設定

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Excel Data',
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
            <label htmlFor="id">ID:</label>
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
            <label htmlFor="password">パスワード:</label>
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
      <h1>CSV Import and Visualization</h1>

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
        <div className="chart-container">
          <h2>{selectedSheet} - Line Chart</h2>
          <Line data={chartData} />
        </div>
      )}
      {/* {chartData && (
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
      )} */}
    </div>
  );
};

export default App;
