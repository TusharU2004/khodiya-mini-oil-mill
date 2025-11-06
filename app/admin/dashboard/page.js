'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './dashboard.css';

export default function AdminDashboard() {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const COLORS = ['#f7971e', '#ffd200', '#ff9f43', '#fdd835', '#ffa726'];

  useEffect(() => {
    // Dummy data for now (replace later with DB/API data)
    const daily = [
      { date: '2025-10-05', earnings: 1200 },
      { date: '2025-10-06', earnings: 1500 },
      { date: '2025-10-07', earnings: 800 },
      { date: '2025-10-08', earnings: 1900 },
      { date: '2025-10-09', earnings: 2200 },
      { date: '2025-10-10', earnings: 1700 },
      { date: '2025-10-11', earnings: 2500 },
    ];

    const monthly = [
      { month: 'January', earnings: 12000 },
      { month: 'February', earnings: 9800 },
      { month: 'March', earnings: 14500 },
      { month: 'April', earnings: 9000 },
      { month: 'May', earnings: 15500 },
      { month: 'June', earnings: 13000 },
      { month: 'July', earnings: 16800 },
      { month: 'August', earnings: 12000 },
      { month: 'September', earnings: 19000 },
      { month: 'October', earnings: 21000 },
    ];

    const pie = [
      { name: 'Groundnut Oil', value: 40000 },
      { name: 'Filtered Oil', value: 25000 },
      { name: 'Byproducts', value: 15000 },
      { name: 'Other Sales', value: 8000 },
    ];

    setDailyData(daily);
    setMonthlyData(monthly);
    setPieData(pie);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome to Khodiya Mini Oil Mill Admin Panel</p>

      <div className="chart-section">
        {/* Daily Earnings Line Chart */}
        <div className="chart-card">
          <h2>Daily Earnings Report</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#f7971e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Earnings Bar Chart */}
        <div className="chart-card">
          <h2>Monthly Earnings Report</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="#ffd200" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product-wise Earnings Pie Chart */}
        <div className="chart-card pie-card">
          <h2>Product-wise Earnings</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}