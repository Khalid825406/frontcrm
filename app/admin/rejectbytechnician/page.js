'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import StatusTimeline from '@/app/components/StatusTimeline';
import AdminLayout from '@/app/components/AdminLayout';
import { Plus, Minus, SearchX } from 'lucide-react';
import './assignman.css';   // <-- new styles below

export default function AdminRejectedJobsPage() {
  const [jobs, setJobs]         = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeJobId, setActiveJobId] = useState(null);
  const accordionRefs = useRef({});

  /* -------------------------------------------------- */
  useEffect(() => { fetchRejectedJobs(); }, []);
  /* -------------------------------------------------- */

  const fetchRejectedJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setError('No token found. Please login again.'); return; }

    try {
      const { data } = await axios.get(
        'https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rejected = data.filter(
        (j) => j.statusTimeline?.[j.statusTimeline.length - 1]?.status === 'Rejected'
      );
      setJobs(rejected);
      setFilteredJobs(rejected);
    } catch (err) {
      console.error(err);
      setError('Failed to load rejected jobs.');
    } finally {
      setLoading(false);
    }
  };

  /* search ------------------------------------------- */
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredJobs(
      jobs.filter(
        (j) =>
          j.customerName.toLowerCase().includes(term) ||
          j.location.toLowerCase().includes(term)
      )
    );
  };

  /* accordion ---------------------------------------- */
  const toggleAccordion = (id) =>
    setActiveJobId((prev) => (prev === id ? null : id));

  useEffect(() => {
    Object.keys(accordionRefs.current).forEach((id) => {
      const el = accordionRefs.current[id];
      if (!el) return;
      el.style.maxHeight = activeJobId === id ? `${el.scrollHeight}px` : '0';
      el.style.padding  = activeJobId === id ? '24px' : '0 24px';
    });
  }, [activeJobId]);

  /* -------------------------------------------------- */
  return (
    <AdminLayout>
      <main className="reject-page">
        <div className="reject-container">
          {/* header ------------------------------------ */}
          <header className="page-header">
            <div>
              <h1 className="page-title">Rejected Jobs</h1>
              <p className="page-subtitle">
                Jobs that were rejected by technicians or admin
              </p>
            </div>
            <div className="search-wrapper">
  <input
    type="text"
    placeholder="Search customer / location"
    value={searchTerm}
    onChange={handleSearch}
    className="search-input"
  />
  <SearchX className="search-icon" size={18} />
</div>
          </header>

          {/* content ----------------------------------- */}
          {error && <Alert type="error" msg={error} />}
          {loading && <SkeletonList />}

          {!loading && filteredJobs.length === 0 && (
            <EmptyState onRetry={fetchRejectedJobs} />
          )}

          <div className="accordion-wrapper">
            {filteredJobs.map((job) => (
              <AccordionCard
                key={job._id}
                job={job}
                isOpen={activeJobId === job._id}
                onToggle={() => toggleAccordion(job._id)}
                timeline={<StatusTimeline timeline={job.statusTimeline} job={job} />}
              />
            ))}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

/* ====================================================== */
/*  Sub-components                                        */
/* ====================================================== */
function AccordionCard({ job, isOpen, onToggle, timeline }) {
  const img = job.images?.[0]
    ? job.images[0].startsWith('http')
      ? job.images[0]
      : `https://new-crm-sdcn.onrender.com${job.images[0]}`
    : '/placeholder.jpg';

  return (
    <div className={`accordion-card ${isOpen ? 'open' : ''}`}>
      {/* header ------------------------------------ */}
      <div className="card-header" onClick={onToggle}>
        <div className="header-left">
          <img src={img} alt="thumbnail" className="thumb" />
          <div>
            <h3 className="cust-name">{job.customerName}</h3>
            <p className="cust-loc">{job.location}</p>
          </div>
        </div>
        <div className="header-right">
          <PriorityBadge val={job.priority} />
          <span className="toggle-icon">
            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
          </span>
        </div>
      </div>

      {/* body -------------------------------------- */}
      <div className="card-body" aria-expanded={isOpen}>
        <img src={img} alt="job" className="card-img" />
        <div className="info-grid">
          <Info label="Phone" value={job.customerPhone} />
          <Info label="Work Type" value={job.workType} />
          <Info label="Department" value={job.Department} />
          <Info label="Date & Time" value={new Date(job.datetime).toLocaleString()} />
          <Info label="Assigned To" value={job.assignedTo?.username || 'Unassigned'} />
          <Info label="Reason" value={job.reason} />
          <Info label="Remarks" value={job.remarks} span />
        </div>
        {timeline}
      </div>
    </div>
  );
}

function Info({ label, value, span }) {
  return (
    <div className={`info-item ${span ? 'span-2' : ''}`}>
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function PriorityBadge({ val }) {
  const map = {
    low: { bg: '#dbeafe', color: '#1e40af' },
    medium: { bg: '#fef3c7', color: '#d97706' },
    high: { bg: '#fee2e2', color: '#dc2626' },
  };
  const s = map[val?.toLowerCase()] || map.medium;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {val}
    </span>
  );
}

function Alert({ type, msg }) {
  return <div className={`alert ${type}`}>{msg}</div>;
}

function SkeletonList() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-card shimmer" />
      ))}
    </div>
  );
}

function EmptyState({ onRetry }) {
  return (
    <div className="empty-state">
      <SearchX size={56} strokeWidth={1.2} />
      <h4>No rejected jobs</h4>
      <p>Great news – nothing rejected right now.</p>
      <button className="retry-btn" onClick={onRetry}>
        Refresh
      </button>
    </div>
  );
}