'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusTimeline from '../../components/StatusTimeline';
import '../assigned-jobs-status/assignman.css';

export default function AdminActiveJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
        const activeJobs = res.data.filter((job) => {
          const latestStatus = job.statusTimeline[job.statusTimeline.length - 1]?.status;
          return latestStatus !== 'Completed' && latestStatus !== 'Rejected';
        });
        setJobs(activeJobs);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const latestStatus = job.statusTimeline[job.statusTimeline.length - 1]?.status || '';

    const matchesQuery =
      job.customerName?.toLowerCase().includes(query) ||
      job.customerPhone?.toLowerCase().includes(query) ||
      job.workType?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query);

    const matchesStatus = statusFilter ? latestStatus === statusFilter : true;

    return matchesQuery && matchesStatus;
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
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Topbar username="Admin" />

        {/* 🔍 Search & Filter */}
        <div style={{ width: '100%',  maxWidth: 1000,  marginBottom: 20, display: 'flex', gap: 12 ,marginTop:20}}>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          >
            <option value="">All Status</option>
            <option value="Assigned">Assigned</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {filteredJobs.length === 0 && !error && <p>No matching jobs found.</p>}

        {filteredJobs.map((j) => (
          <div
            key={j._id}
            className="job-card-status"
            style={{
              marginBottom: 20,
              padding: 15,
              border: '1px solid #ccc',
              borderRadius: 8,
              width: '470px',
              background: '#f7f8f9',
            }}
          >
            <div>
              {j.images?.[0] && (
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
      </main>
    </div>
  );
}
