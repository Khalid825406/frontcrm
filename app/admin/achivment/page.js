'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/app/components/AdminLayout';
import './achivment.css';

export default function TechnicianLeaderboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/technician/achievements')
      .then(({ data }) => {
        setList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <main className="lb-wrap">
        <div className="lb-container">
          <header className="lb-header">
            <h1 className="lb-title">Technician Leaderboard</h1>
            <p className="lb-sub">Top performers this month</p>
          </header>

          <div className="lb-table-wrapper">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Technician</th>
                  <th>Completed</th>
                  <th>Rejection</th>
                  <th>Avg Response</th>
                  <th>Avg Duration</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                  : list.length === 0
                  ? <tr><td colSpan={7} className="no-data">No data available</td></tr>
                  : list.map((t, i) => <LiveRow data={t} idx={i} key={t.technicianId || i} />)}
              </tbody>
            </table>
          </div>

          <footer className="lb-footer">
            <div className="lb-badges">
              <span>🏆 High Score</span>
              <span>⏱️ Fast Response</span>
              <span>✅ Reliable</span>
            </div>
          </footer>
        </div>
      </main>
    </AdminLayout>
  );
}

/* ---------- Skeleton Row ---------- */
function SkeletonRow() {
  return (
    <tr className="lb-row">
      <td><div className="skel skel-rank" /></td>
      <td><div className="skel skel-name" /></td>
      <td><div className="skel skel-sm" /></td>
      <td><div className="skel skel-sm" /></td>
      <td><div className="skel skel-sm" /></td>
      <td><div className="skel skel-sm" /></td>
      <td><div className="skel skel-score" /></td>
    </tr>
  );
}

/* ---------- Live Row ---------- */
function LiveRow({ data, idx }) {
  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
  const rejectClr = +data.rejectionRate.replace('%','') > 10 ? 'text-warn' : 'text-ok';

  return (
    <tr className={`lb-row ${idx % 2 ? 'even' : 'odd'}`}>
      <td className="rank">{medal}</td>
      <td className="tech">
        <div className="tech-badge">{data.name.charAt(0)}</div>
        <span>{data.name}</span>
      </td>
      <td>{data.completedJobs ?? 0}</td>
      <td className={rejectClr}>{data.rejectionRate}</td>
      <td>{data.avgResponseTimeMins} min</td>
      <td>{data.avgCompletionTimeMins} min</td>
      <td className="score">{Number(data.score).toFixed(1)}</td>
    </tr>
  );
}