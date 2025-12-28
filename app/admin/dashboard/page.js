/* app/admin/dashboard/page.js  (or page.jsx) */
'use client';

import { useEffect, useState } from 'react';
import './AdminDashboard.css'

import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  FileClock, UserCheck, Users, Briefcase, CheckCircle, Trash2, SquarePen
} from 'lucide-react';
import EditUserModal from './EditUserModal';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import AdminLayout from '@/app/components/AdminLayout';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/* ---------- skeletons ---------- */
const SkeletonCard = () => (
  <div className="card skeleton-card">
    <div>
      <div className="skeleton skeleton-count" />
      <div className="skeleton skeleton-label" />
    </div>
    <div className="skeleton skeleton-icon" />
  </div>
);
const SkeletonTableRow = ({ cols }) => (
  <tr>
    {Array(cols).fill(0).map((_, i) => (
      <td key={i}><div className="skeleton skeleton-cell" /></td>
    ))}
  </tr>
);

/* ---------- main component ---------- */
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Login required');
      window.location.href = '/login';
      return;
    }
    try {
      const [uRes, jRes] = await Promise.all([
        fetch('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (uRes.status === 401 || jRes.status === 401) {
        toast.error('Session expired');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const uData = await uRes.json();
      const jData = await jRes.json();
      setUsers(Array.isArray(uData) ? uData : uData.users || []);
      setJobs(Array.isArray(jData) ? jData : jData.jobs || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/delete-user/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        toast.success('User deleted');
        fetchData();
      } else toast.error('Delete failed');
    } catch {
      toast.error('Delete error');
    }
  }

  /* ---------- filters ---------- */
  const pendingUsers = users.filter((u) => !u.approved && !u.rejected);
  const otherUsers   = users.filter((u) => u.approved || u.rejected);
  const pendingJobs  = jobs.filter((j) => !j.approved && !j.rejected);
  const assignedJobs = jobs.filter(
    (j) => j.assignedTo && j.status !== 'Completed' && j.status !== 'Cancelled'
  );
  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const approvedJobs  = jobs.filter((j) => j.approved);

  const barData = {
    labels: ['P-Users', 'A-Users', 'P-Jobs', 'A-Jobs', 'Completed'],
    datasets: [
      {
        label: 'Count',
        data: [
          pendingUsers.length,
          otherUsers.length,
          pendingJobs.length,
          approvedJobs.length,
          completedJobs.length,
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#14b8a6', '#22c55e'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          users.filter((u) => !u.approved && !u.rejected).length,
          users.filter((u) => u.approved).length,
          users.filter((u) => u.rejected).length,
        ],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      },
    ],
  };

  const getStatus = (item) =>
    item.approved ? 'Approved' : item.rejected ? 'Rejected' : 'Pending';

  /* ---------- loading UI ---------- */
  if (loading)
    return (
  <AdminLayout>
      <div className="admin-dashboard">
        
        <main className="admin-main">
        
          <div className="cards-wrapper">
            {Array(7).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="table-wrapper">
            <h2>All Users</h2>
            <table className="data-table">
              <thead>
                <tr>
                  {['Username', 'Role', 'Status', 'Phone', 'Action'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(0).map((_, i) => (
                  <SkeletonTableRow key={i} cols={5} />
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      </AdminLayout>
    );

  /* ---------- main UI ---------- */
  return (
    <AdminLayout>
    <div className="admin-dashboard">
      <main className="admin-main">

        {/* ---------- cards ---------- */}
        <div className="cards-wrapper">
          <DashboardCard
            href="/admin/pending-approvals"
            color="blue"
            count={pendingUsers.length}
            label="Pending User Approvals"
            icon={<UserCheck size={28} />}
          />
          <DashboardCard
            href="/admin/pending-job-approvals"
            color="green"
            count={pendingJobs.length}
            label="Pending Job Approvals"
            icon={<FileClock size={28} />}
          />
          <DashboardCard
            href="/admin/dashboard"
            color="orange"
            count={users.length}
            label="All Users"
            icon={<Users size={28} />}
          />
          <DashboardCard
            href="/admin/assigned-jobs-status"
            color="purple"
            count={assignedJobs.length}
            label="Active Assigned Jobs"
            icon={<Briefcase size={28} />}
          />
          <DashboardCard
            href="/admin/completed"
            color="emerald"
            count={completedJobs.length}
            label="Completed Jobs"
            icon={<CheckCircle size={28} />}
          />
          <DashboardCard
            href="/admin/alljob"
            color="red"
            count={jobs.length}
            label="All Jobs"
            icon={<Briefcase size={28} />}
          />
          <DashboardCard
            href="/admin/approved-jobs"
            color="teal"
            count={approvedJobs.length}
            label="Approved Jobs"
            icon={<CheckCircle size={28} />}
          />
        </div>

        {/* ---------- charts ---------- */}
        <div className="charts-wrapper">
          <div className="chart-box">
            <h3>Overview Stats</h3>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="chart-box">
            <h3>User Status</h3>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>

        {/* ---------- users table ---------- */}
        <div className="table-wrapper">
          <h2>All Users</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Phone</th>
                <th style={{ width: 120 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {otherUsers.length ? (
                otherUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-pill status-${getStatus(user).toLowerCase()}`}>
                        {getStatus(user)}
                      </span>
                    </td>
                    <td>{user.phone}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="btn-icon btn-secondary"
                          onClick={() => setEditingUser(user)}
                        >
                          <SquarePen size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-message">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- edit modal ---------- */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={() => {
              setEditingUser(null);
              fetchData();
            }}
          />
        )}
      </main>
    </div>
    </AdminLayout>
  );
}

/* ---------- sub-component ---------- */
function DashboardCard({ href, color, count, label, icon }) {
  return (
    <Link href={href} className="dashboard-link">
      <div className={`card card-${color}`}>
        <div className="card-left">
          <div className="card-count">{count}</div>
          <div className="card-label">{label}</div>
        </div>
        <div className="card-icon">{icon}</div>
      </div>
    </Link>
  );
}