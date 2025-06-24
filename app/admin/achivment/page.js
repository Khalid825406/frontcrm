'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../achivment/achivment.css';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function TechnicianLeaderboard() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    axios.get('https://new-crm-sdcn.onrender.com/api/technician/achievements')
      .then(res => setAchievements(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar on the left */}
      <div className="sidebar-wrapper">
        <Sidebar role="admin" />
      </div>

      {/* Main content on the right */}
      <div className="content-wrapper">
        <Topbar username="admin" />
        <div className="leaderboard-container">
          <h1 className="leaderboard-heading">🏆 Leaderboard</h1>

          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr className="leaderboard-header">
                  <th>Rank</th>
                  <th>Technician</th>
                  <th>Completed</th>
                  <th>Rejection Rate</th>
                  <th>Avg Response Time</th>
                  <th>Avg Work Duration</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
            {achievements.map((tech, index) => (
                <tr key={tech.technicianId?.toString() || index} className={`leaderboard-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <td className="rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td>{tech.name}</td>
                <td>{tech.completedJobs}</td>
                <td>{tech.rejectionRate}</td>
                <td>{tech.avgResponseTimeMins} mins</td>
                <td>{tech.avgCompletionTimeMins} mins</td>
                <td className="score">{tech.score.toFixed(1)}</td>
                </tr>
            ))}
            </tbody>

            </table>
          </div>

          <div className="leaderboard-footer">
            <div className="leaderboard-badges">
              <div>🏆 High Score</div>
              <div>⏱️ Fast Response</div>
              <div>✅ Reliable Worker</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
