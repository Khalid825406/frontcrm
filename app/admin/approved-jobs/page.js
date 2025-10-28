'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/app/components/AdminLayout';
import './approval.css';

export default function ApprovedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techs, setTechs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [techSearch, setTechSearch] = useState('');

  /* ---------- data ---------- */
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const f = jobs.filter((j) => {
      const m =
        j.customerName.toLowerCase().includes(search.toLowerCase()) ||
        j.customerPhone.includes(search) ||
        j.workType.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase());
      const p = priority === 'All' || j.priority.toLowerCase() === priority.toLowerCase();
      return m && p;
    });
    setFiltered(f);
  }, [search, priority, jobs]);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approved = data
        .filter((j) => {
          const t = j.statusTimeline || [];
          const last = t.length ? t[t.length - 1].status : null;
          return j.approved && !j.rejected && (!j.assignedTo || last === 'Rejected');
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(approved);
    } catch {
      toast.error('Failed to fetch approved jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechs = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-technicians', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechs(data);
      setShowModal(true);
    } catch {
      toast.error('Failed to fetch technicians');
    }
  };

  const handleAssign = (jobId) => {
    setSelectedJobId(jobId);
    fetchTechs();
  };

  const confirmAssign = async (techId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://new-crm-sdcn.onrender.com/api/admin/assign-job',
        { jobId: selectedJobId, technicianId: techId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Technician assigned');
      setShowModal(false);
      fetchJobs();
    } catch {
      toast.error('Assignment failed');
    }
  };

  /* ---------- render ---------- */
  return (
    <AdminLayout>
      <div className="aj-shell">
        <header className="aj-header">
          <h1 className="aj-title">Approved Jobs</h1>
          <p className="aj-subtitle">Jobs ready for technician assignment</p>
        </header>

        <div className="aj-toolbar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="aj-search"
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="aj-filter">
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <Empty />
        ) : (
          <Table data={filtered} onAssign={handleAssign} />
        )}

        {showModal && (
          <Modal
            techs={techs}
            techSearch={techSearch}
            setTechSearch={setTechSearch}
            onSelect={confirmAssign}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- sub-components ---------- */
function Table({ data, onAssign }) {
  return (
    <div className="aj-table-wrap">
      <table className="aj-table">
        <thead>
          <tr>
            <th className="aj-shrink">Image</th> {/* image */}
            <th>Customer</th>
            <th>Work Type</th>
            <th>Date / Time</th>
            <th>Priority</th>
            <th>Location</th>
            <th>Status</th>
            <th className="aj-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((j) => {
            const isRejected = j.statusTimeline?.some((s) => s.status === 'Rejected');
            const img = j.images?.[0]
              ? j.images[0].startsWith('http')
                ? j.images[0]
                : `https://new-crm-sdcn.onrender.com${j.images[0]}`
              : '/placeholder.jpg';
            return (
              <tr key={j._id}>
                <td data-label="Image" className="aj-shrink">
                  <img src={img} alt="" className="aj-thumb" />
                </td>
                <td data-label="Customer">
                  <span className="aj-customer">{j.customerName}</span>
                  <span className="aj-phone">{j.customerPhone}</span>
                </td>
                <td data-label="Work Type">{j.workType}</td>
                <td data-label="Date / Time">{new Date(j.datetime).toLocaleString()}</td>
                <td data-label="Priority">
                  <PriorityBadge val={j.priority} />
                </td>
                <td data-label="Location">{j.location}</td>
                <td data-label="Status">
                  <span className={`aj-status ${isRejected ? 'rejected' : 'approved'}`}>
                    {isRejected ? 'Rejected by Tech' : 'Approved'}
                  </span>
                </td>
                <td data-label="Actions" className="aj-right">
                  <button
                    onClick={() => onAssign(j._id)}
                    className={`aj-btn ${isRejected ? 'aj-reassign' : 'aj-assign'}`}
                  >
                    {isRejected ? 'Re-assign' : 'Assign'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PriorityBadge({ val }) {
  const map = {
    low: { bg: '#dbeafe', color: '#1e40af' },
    medium: { bg: '#fef3c7', color: '#d97706' },
    high: { bg: '#fee2e2', color: '#dc2626' },
  };
  const style = map[val?.toLowerCase()] || map.medium;
  return (
    <span className="aj-badge" style={{ background: style.bg, color: style.color }}>
      {val}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="aj-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aj-skel-row">
          <div className="aj-skel aj-skel-thumb" />
          <div className="aj-skel" style={{ width: '25%' }} />
          <div className="aj-skel" style={{ width: '15%' }} />
          <div className="aj-skel" style={{ width: '20%' }} />
          <div className="aj-skel" style={{ width: '10%' }} />
          <div className="aj-skel" style={{ width: '15%' }} />
          <div className="aj-skel" style={{ width: '10%' }} />
          <div className="aj-skel" style={{ width: '80px' }} />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="aj-empty">
      <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
        <path stroke="#cbd5e1" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3>All caught up</h3>
      <p>No approved jobs waiting for assignment.</p>
    </div>
  );
}

function Modal({ techs, techSearch, setTechSearch, onSelect, onClose }) {
  const filtered = techs.filter(
    (t) =>
      t.username.toLowerCase().includes(techSearch.toLowerCase()) ||
      t.phone.includes(techSearch)
  );

  return (
    <div className="aj-modal-overlay">
      <div className="aj-modal">
        <button className="aj-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h3 className="aj-modal-title">Select Technician</h3>
        <input
          type="text"
          placeholder="Search technician..."
          value={techSearch}
          onChange={(e) => setTechSearch(e.target.value)}
          className="aj-modal-search"
        />
        <ul className="aj-modal-list">
          {filtered.map((t) => (
            <li key={t._id} className="aj-modal-item">
              <div>
                <div className="aj-modal-name">{t.username}</div>
                <div className="aj-modal-phone">{t.phone}</div>
              </div>
              <button onClick={() => onSelect(t._id)} className="aj-modal-assign">
                Assign
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}