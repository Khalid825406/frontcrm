'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusTimeline from '../../components/StatusTimeline';
import '../completed/assignman.css';

export default function AdminCompletedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      setError('No token found. Please login again.');
      return;
    }

    axios
      .get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const completedJobs = res.data.filter((job) => {
          const latestStatus = job.statusTimeline[job.statusTimeline.length - 1]?.status;
          return latestStatus === 'Completed';
        });
        setJobs(completedJobs);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const jobDate = new Date(job.datetime).toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const matchesQuery =
      job.customerName?.toLowerCase().includes(query) ||
      job.customerPhone?.toLowerCase().includes(query) ||
      job.workType?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query);

    const matchesDate = filterDate ? jobDate === filterDate : true;

    return matchesQuery && matchesDate;
  });

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <main
        className="assignman"
        style={{
          marginLeft: 240,
          padding: 20,
          flexGrow: 1,
          marginTop: 40,
        }}
      >
        <Topbar username="Admin" />

        {/* 🔍 Search & Date Filter */}
        <div className='search-box'  style={{ width: '100%', maxWidth: 1000, display: 'flex', gap: 12, margin: '12px auto', background:'rgb(247, 248, 249)', padding:12, borderRadius:5,}}>
          <input
            type="text"
            placeholder="Search by customer, phone, work type, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: 10,
              flex: 1,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {filteredJobs.length === 0 && !error && <p>No completed jobs found.</p>}

            <div className='meicsdasw'>
        {filteredJobs.map((j) => (
          <div
            key={j._id}
            className="job-card-status"
            style={{
              marginBottom: 20,
              padding: 15,
              border: '1px solid #ccc',
              borderRadius: 8,
              width: 470,
              background: '#f7f8f9',
            }}
          >
            <div>
              {j.images && j.images[0] && (
                <img
                  src={j.images[0]}
                  alt="Job"
                  style={{ width: '100%', height: 250, borderRadius: '10px 10px 0px 0px' }}
                />
              )}
              <div className="mainsdflrx">
                <div className="maieerrdds">
                  <div className="info-block">
                    <div className="info-label">Customer Name</div>
                    <div className="info-value">{j.customerName}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Number</div>
                    <div className="info-value">{j.customerPhone}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Work Type</div>
                    <div className="info-value">{j.workType}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Department</div>
                    <div className="info-value">{j.Department}</div>
                  </div>
                </div>
                <div className="maieerrdds">
                  <div className="info-block">
                    <div className="info-label">Location</div>
                    <div className="info-value">{j.location}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Priority</div>
                    <div className="info-value">{j.priority}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Reason</div>
                    <div className="info-value">{j.reason}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Assigned To</div>
                    <div className="info-value">{j.assignedTo?.username || 'Unassigned'}</div>
                  </div>
                </div>
              </div>

              <div className="info-block">
                <div className="info-label">Date & Time</div>
                <div className="info-value">{new Date(j.datetime).toLocaleString()}</div>
              </div>

              <div className="remark-box">📌 Remark: {j.remarks}</div>
            </div>

            <StatusTimeline timeline={j.statusTimeline} job={j} />
          </div>
        ))}
           </div>
      </main>
    </div>
  );
}