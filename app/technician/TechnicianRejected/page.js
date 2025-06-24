'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../jobs/jobs.css'

export default function TechnicianRejectedJobsPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('https://new-crm-sdcn.onrender.com/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.data.user && res.data.role === 'technician') {
        setUser({ username: res.data.user });
      }
    });

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.token;
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rejected = res.data.filter(job => job.status === 'Rejected' && job.assignedTo);
      setJobs(rejected);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="layout">
      <Sidebar role="technician" />
      <div className="main">
        <Topbar username={user?.username || ''} />
        <div className="main-content">
          <h2 className="page-title">Rejected Jobs</h2>
          {jobs.length === 0 ? <p>No rejected jobs.</p> : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                 {job.images?.length > 0 && (
                  <img
                    src={
                      job.images?.[0]?.startsWith('http')
                        ? job.images[0]
                        : `https://new-crm-sdcn.onrender.com${job.images?.[0]}`
                    }
                    alt={job.customerName}
                    className="job-image"
                  />
                )}
                 <div className="job-card-details">
                    <h3 className="job-title">Customer Name : {job.customerName}</h3>
                    <p><strong>📞 Phone:</strong> {job.customerPhone}</p>
                    <p><strong>🔧 Work Type:</strong> {job.workType}</p>
                    <p><strong>🏢 Department:</strong> {job.Department}</p>
                    <p><strong>📝 Reason:</strong> {job.reason}</p>
                    <p><strong>📅 Date/Time:</strong> {new Date(job.datetime).toLocaleString()}</p>
                    <p><strong>📍 Location:</strong> {job.location}</p>
                    <p><strong>⚠️ Priority:</strong> {job.priority}</p>
                    <p><strong>🗒️ Remarks:</strong> {job.remarks}</p>
                    <p className={`job-status ${job.status.toLowerCase()}`}>
                    <strong>🔄 Status:</strong> {job.status}
                    </p>
                     <p><strong>Reason:</strong> {job.rejectionReason || 'N/A'}</p>
                </div>
               
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}