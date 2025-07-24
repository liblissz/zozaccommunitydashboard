// ==== FRONTEND (React + Recharts + Styled Analytics) ====
// Analytics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF0', '#FF6699'];

const Analytics = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://zozacbackend.onrender.com/api/company/project/post");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const dataByCategory = Object.values(
    projects.reduce((acc, curr) => {
      const category = curr.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { category, count: 0 };
      }
      acc[category].count++;
      return acc;
    }, {})
  );

  const dataByCompletion = [
    { name: 'Completed', value: projects.filter(p => p.isCompleted).length },
    { name: 'Pending', value: projects.filter(p => !p.isCompleted).length }
  ];

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const averageBudget = projects.length ? (totalBudget / projects.length).toFixed(2) : 0;

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Company Project Analytics</h1>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Projects by Category</h3>
          <ResponsiveContainer  width="100%" height={300}>
            <BarChart data={dataByCategory} >
              <XAxis dataKey="category" />
              <YAxis className={"cc"} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" style={{width: "70px"}}  radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Completion Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataByCompletion}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {dataByCompletion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-summary">
        <p><strong>Total Projects:</strong> {projects.length}</p>
        <p><strong>Total Budget:</strong> {totalBudget.toLocaleString()}frs</p>
        <p><strong>Average Budget:</strong> {averageBudget}frs</p>
      </div>
    </div>
  );
};

export default Analytics;
