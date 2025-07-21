'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusTimeline from '../../components/StatusTimeline';
import './assignman.css';
import { Plus, Minus } from 'lucide-react';

export default function AdminRejectedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const accordionRefs = useRef({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login again.');
      return;
    }

    axios
      .get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const rejectedJobs = res.data.filter(
          (job) => job.statusTimeline[job.statusTimeline.length - 1]?.status === 'Rejected'
        );
        setJobs(rejectedJobs);
        setFilteredJobs(rejectedJobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching rejected jobs:', err);
        setError('Failed to load jobs. Please try again.');
        setLoading(false);
      });
  }, []);

  const toggleAccordion = (jobId) => {
    setActiveJobId((prev) => (prev === jobId ? null : jobId));
  };

  useEffect(() => {
    Object.keys(accordionRefs.current).forEach((id) => {
      const el = accordionRefs.current[id];
      if (!el) return;

      if (activeJobId === id) {
        el.style.maxHeight = el.scrollHeight + 'px';
        el.style.padding = '20px';
      } else {
        el.style.maxHeight = '0px';
        el.style.padding = '0 20px';
      }
    });
  }, [activeJobId]);

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

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <main
        className="assignman"
        style={{ marginLeft: 240, padding: 20, flexGrow: 1, marginTop: 40 }}
      >
        <Topbar username="Admin" />
        <div className='maininput'>
          <input
            type="text"
            placeholder="🔍 Search by customer name or location"
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: '10px 14px',
              width: '100%',
              maxWidth: 400,
              borderRadius: 6,
              border: '1px solid #ccc',
              marginBottom: 20,
            }}
          />
        </div>


        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && (
          <div className="skeleton-wrapper">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-card shimmer">
                <div className="skeleton-img" />
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            ))}
          </div>

        )}

        {!loading && filteredJobs.length === 0 && !error && (
          <p>No rejected jobs found.</p>
        )}

        <div className="accordion-container">
          {filteredJobs.map((j) => (
            <div key={j._id} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => toggleAccordion(j._id)}
              >
                <div className="accordion-title">
                  <div className='acordion-name'>Customer Name : {j.customerName} </div>
                  <div className='acordion-name'>Location : {j.location} </div>
                </div>
                <span>
                  {activeJobId === j._id ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </div>
              <div
                className="accordion-body"
                ref={(el) => (accordionRefs.current[j._id] = el)}
              >
                {j.images?.[0] && (
                  <img
                    src={j.images[0]}
                    alt="Job"
                    className="accordion-image"
                  />
                )}

                <div className="accordion-grid">
                  <div><strong>📞 Phone:</strong> {j.customerPhone}</div>
                  <div><strong>🛠 Work Type:</strong> {j.workType}</div>
                  <div><strong>🏢 Department:</strong> {j.Department}</div>
                  <div><strong>📍 Location:</strong> {j.location}</div>
                  <div><strong>⚡ Priority:</strong> {j.priority}</div>
                  <div><strong>🙅‍♂️ Reason:</strong> {j.reason}</div>
                  <div><strong>👨‍🔧 Assigned To:</strong> {j.assignedTo?.username || 'Unassigned'}</div>
                  <div><strong>🕒 Date & Time:</strong> {new Date(j.datetime).toLocaleString()}</div>
                  <div><strong>📝 Remark:</strong> {j.remarks}</div>
                </div>

                <StatusTimeline timeline={j.statusTimeline} job={j} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}