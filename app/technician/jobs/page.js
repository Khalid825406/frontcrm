

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../jobs/jobs.css';

export default function TechnicianJobsPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadJobId, setUploadJobId] = useState(null);
  const [uploadType, setUploadType] = useState('');
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadRemarks, setUploadRemarks] = useState('');

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
    })
    .catch(err => {
      console.error('User fetch error:', err);
    });

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.token;
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const technicianJobs = res.data.filter(job => job.assignedTo);
      setJobs(technicianJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (jobId) => {
    const token = localStorage.token;
    await axios.post(`https://new-crm-sdcn.onrender.com/api/admin/accept-job/${jobId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
  };

  const handleRejectModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    const token = localStorage.token;
    await axios.post(`https://new-crm-sdcn.onrender.com/api/admin/reject-job/${selectedJobId}`, {
      reason,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReason('');
    setShowRejectModal(false);
    fetchJobs();
  };

  const openUploadModal = (jobId, type) => {
    setUploadJobId(jobId);
    setUploadType(type);
    setUploadModal(true);
  };

  const submitUpload = async () => {
    const token = localStorage.token;
    const formData = new FormData();
    formData.append('image', uploadImage);
    formData.append('remarks', uploadRemarks);
    formData.append('type', uploadType);

    const endpoint = uploadType === 'start' ? 'start-work' : 'complete-work';

    await axios.post(`https://new-crm-sdcn.onrender.com/api/technician/${endpoint}/${uploadJobId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });


    setUploadModal(false);
    setUploadImage(null);
    setUploadRemarks('');
    fetchJobs();
  };


  return (
    <div className="layout">
      <Sidebar role="technician" />
      <div className="main">
        <Topbar username={user?.username || ''} />
        <div className="main-content">
          <h2 className="page-title">Assigned Jobs</h2>
          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs assigned yet.</p>
          ) : (
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
                <h4 className="job-title">Customer Name : {job.customerName}</h4>
                <p><strong>Phone:</strong> {job.customerPhone}</p>
                <p><strong>Work Type:</strong> {job.workType}</p>
                <p><strong>Reason:</strong> {job.reason}</p>
                <p><strong>Date/Time:</strong> {new Date(job.datetime).toLocaleString()}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Priority:</strong> {job.priority}</p>
                <p><strong>Remarks:</strong> {job.remarks}</p>
               
                <p>Status: <strong>{job.status}</strong></p>

                <div className="button-group">
                  {job.status === 'Assigned' && (
                    <>
                      <button onClick={() => handleAccept(job._id)} className="btn accept-btn">Accept</button>
                      <button onClick={() => handleRejectModal(job._id)} className="btn reject-btn">Reject</button>
                    </>
                  )}

                  {job.status === 'Accepted' && (
                      <button onClick={() => openUploadModal(job._id, 'start')} className="btn progress-btn">
                        Start Work
                      </button>
                  )}

                  {job.status === 'In Progress' && (
                    <button onClick={() => openUploadModal(job._id, 'complete')} className="btn complete-btn">
                      Mark as Completed
                    </button>
                  )}

                </div>
              </div>
            ))
          )}

          {showRejectModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">Reason for Rejection</h3>
                <textarea
                  className="modal-textarea"
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="modal-actions">
                  <button onClick={submitReject} className="btn reject-btn">Submit</button>
                  <button onClick={() => setShowRejectModal(false)} className="btn cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {uploadModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">{uploadType === 'start' ? 'Start Work' : 'Mark as Completed'}</h3>
                <input type="file" onChange={(e) => setUploadImage(e.target.files[0])} className="modal-input" required/>
                <textarea
                  className="modal-textarea"
                  placeholder="Enter remarks"
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                  required
                />
                <div className="modal-actions">
                  <button onClick={submitUpload} className="btn submit-btn">Submit</button>
                  <button onClick={() => setUploadModal(false)} className="btn cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}