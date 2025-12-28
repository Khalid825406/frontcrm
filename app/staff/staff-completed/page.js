'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatusTimeline from '../../components/StatusTimeline';
import '../staff-completed/completed.css'

export default function AdminCompletedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.token;
    if (!token) {
      setError('No token found. Please login again.');
      return;
    }

    axios
      .get('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/assigned-jobs-status', {
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

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="staff" />
      <main className='created' style={{ marginLeft: 240, padding: 20, flexGrow: 1, marginTop: 40 }}>
        <h2>Completed Jobs</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {jobs.length === 0 && !error && <p>No completed jobs found.</p>}
        <div className='meicsdasw'>
        {jobs.map((j) => (
          <div
            key={j._id}
            className="job-card-status"
            style={{ marginBottom: 20, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}
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
        <Topbar username="newstaff" />
      </main>
    </div>
  );
}