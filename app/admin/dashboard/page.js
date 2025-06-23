
'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../dashboard/AdminDashboard.css';
import {
  FileClock,
  UserCheck,
  Users,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const resUsers = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataUsers = await resUsers.json();
      setUsers(Array.isArray(dataUsers) ? dataUsers : []);

      const resJobs = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataJobs = await resJobs.json();
      setJobs(Array.isArray(dataJobs) ? dataJobs : []);
    } catch (err) {
      console.error(err);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  const pendingUsers = users.filter(u => !u.approved && !u.rejected);
  const otherUsers = users.filter(u => u.approved || u.rejected);
  const pendingJobs = jobs.filter(j => !j.approved && !j.rejected);
  const assignedJobs = jobs.filter(j => j.assignedTechnician);
  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const approvedJobs = jobs.filter(j => j.approved);

  function getStatus(item) {
    if (item.approved) return 'Approved';
    if (item.rejected) return 'Rejected';
    return 'Pending';
  }

  function getStatusColor(status) {
    if (status === 'Approved') return '#4CAF50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
  }

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />
      <main className="admin-main">
        <Topbar username="Admin" />

        <div className="cards-wrapper">
          <DashboardCard color="blue" count={pendingUsers.length} label="Pending User Approvals" icon={<UserCheck size={54} />} />
          <DashboardCard color="green" count={pendingJobs.length} label="Pending Job Approvals" icon={<FileClock size={54} />} />
          <DashboardCard color="orange" count={users.length} label="All Users" icon={<Users size={54} />} />
          <DashboardCard color="purple" count={assignedJobs.length} label="Assigned Jobs" icon={<Briefcase size={54} />} />
          <DashboardCard color="emerald" count={completedJobs.length} label="Completed Jobs" icon={<CheckCircle size={54} />} />
          <DashboardCard color="red" count={jobs.length} label="All Jobs" icon={<Briefcase size={54} />} />
          <DashboardCard color="teal" count={approvedJobs.length} label="Approved Jobs" icon={<CheckCircle size={54} />} />
        </div>

        <SectionTable
          title="All Users"
          columns={["Username", "Role", "Status", "Number"]}
          data={otherUsers}
          renderRow={(user) => (
            <>
              <td className="table-cell">{user.username}</td>
              <td className="table-cell">{user.role}</td>
              <td className="table-cell" style={{ color: getStatusColor(getStatus(user)), fontWeight: 600 }}>{getStatus(user)}</td>
              <td className="table-cell">{user.phone}</td>
            </>
          )}
          emptyMessage="No users found."
        />
      </main>
    </div>
  );
}

function DashboardCard({ color, count, label, icon }) {
  return (
    <div className={`card card-${color}`}> 
      <div>
        <div className="card-count">{count}</div>
        <div>{label}</div>
      </div>
      <div>{icon}</div>
    </div>
  );
}

function SectionTable({ title, columns, data, renderRow, emptyMessage }) {
  return (
    <div className="table-wrapper">
      <h2>{title}</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="table-head">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-message">{emptyMessage}</td></tr>
            ) : (
              data.map(item => <tr key={item._id}>{renderRow(item)}</tr>)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}