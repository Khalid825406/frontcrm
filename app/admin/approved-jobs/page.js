'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../approved-jobs/approval.css';

export default function ApprovedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    fetchApprovedJobs();
  }, []);


  const fetchApprovedJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approved = res.data.filter((job) => job.approved && !job.rejected && !job.assignedTo);
      setJobs(approved);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch approved jobs');
    } finally {
      setLoading(false);
    }
  };

 
  const fetchTechnicians = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-technicians', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch technicians');
    }
  };


  const handleAssignTechnician = async (technicianId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'https://new-crm-sdcn.onrender.com/api/admin/assign-job',
        { jobId: selectedJobId, technicianId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Technician assigned successfully');
      setShowModal(false);
      fetchApprovedJobs(); 
    } catch (err) {
      console.error(err);
      alert('Failed to assign technician');
    }
  };

  const handleAssign = (jobId) => {
    setSelectedJobId(jobId);
    fetchTechnicians();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role="admin" />
      <main style={{ flex: 1, backgroundColor: '#f9f9f9', marginLeft: 240, paddingTop: 60, padding: 20, overflowY: 'auto' }}>
        <Topbar username="Admin" />
        <div style={{ maxWidth: 1400, margin: '60px auto' }}>
          <h2 style={{ marginBottom: 20 }}>Approved Jobs</h2>
          <JobCards jobs={jobs} loading={loading} onAssign={handleAssign} />
        </div>

  
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Select Technician</h3>
              <ul className="technician-list">
                {technicians.map((tech) => (
                  <li key={tech._id}>
                     {tech.username} ({tech.phone}){' '}
                    <button onClick={() => handleAssignTechnician(tech._id)} style={{ marginLeft: 10 }}>
                      Assign
                    </button>
                     <button onClick={() => setShowModal(false)}>Cancel</button>
                  </li>
                ))}
              </ul>
             
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function JobCards({ jobs, loading, onAssign }) {
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (jobs.length === 0) return <p style={{ padding: 20 }}>No approved jobs found.</p>;

  return (
    <div className="card-container">
      {jobs.map((job) => (
        <div className="job-card" key={job._id}>
            <img
              src={
                job.images?.[0]?.startsWith('http')
                  ? job.images[0]
                  : `https://new-crm-sdcn.onrender.com${job.images?.[0]}`
              }
              alt={job.customerName}
              className="job-image"
            />
          <div className="job-details">
            <h3>Customer Name : {job.customerName}</h3>
            <p><strong>Phone:</strong> {job.customerPhone}</p>
            <p><strong>Work Type:</strong> {job.workType}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Date/Time:</strong> {new Date(job.datetime).toLocaleString()}</p>
            <p><strong>Reason:</strong> {job.reason}</p>
            <p><strong>Priority:</strong> {job.priority}</p>
            <p><strong>Remarks:</strong> {job.remarks}</p>
            <p className="job-status">Status: Approved</p>
            <button className="assign-button" onClick={() => onAssign(job._id)}>Assign</button>
          </div>
        </div>
      ))}
    </div>
  );
}