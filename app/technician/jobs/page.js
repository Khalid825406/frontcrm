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
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [loadingActionType, setLoadingActionType] = useState('');

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
    .catch(err => console.error('User fetch error:', err));

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.token;
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(job =>
        ['Assigned', 'Accepted', 'In Progress'].includes(job.status) && job.assignedTo
      );
      setJobs(filtered);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
      setLoadingJobId(null);
      setLoadingActionType('');
    }
  };

  const handleAccept = async (jobId) => {
    setLoadingJobId(jobId);
    setLoadingActionType('accept');

    try {
      const token = localStorage.token;
      await axios.post(`https://new-crm-sdcn.onrender.com/api/admin/accept-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleRejectModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    setLoadingJobId(selectedJobId);
    setLoadingActionType('reject');
    try {
      const token = localStorage.token;
      await axios.post(`https://new-crm-sdcn.onrender.com/api/admin/reject-job/${selectedJobId}`, {
        reason,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReason('');
      setShowRejectModal(false);
      fetchJobs();
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const openUploadModal = (jobId, type) => {
    setUploadJobId(jobId);
    setUploadType(type);
    setUploadModal(true);
  };

  const submitUpload = async () => {
    if (!uploadImage || !uploadRemarks) {
      alert('Please provide both image and remarks');
      return;
    }

    setLoadingJobId(uploadJobId);
    setLoadingActionType(uploadType);

    try {
      const formData = new FormData();
      formData.append('image', uploadImage);
      formData.append('remarks', uploadRemarks);

      const token = localStorage.token;
      const endpoint = uploadType === 'start' ? 'start-work' : 'complete-work';

      await axios.post(
        `https://new-crm-sdcn.onrender.com/api/technician/${endpoint}/${uploadJobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadModal(false);
      setUploadImage(null);
      setUploadRemarks('');
      fetchJobs();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload. Please try again.');
    } finally {
      setLoadingJobId(null);
      setLoadingActionType('');
    }
  };

  return (
    <div className="layout">
      <Sidebar role="technician" />
      <div className="main">
        <Topbar username={user?.username || ''} />
        <div className="main-content">
          <h2 className="page-title">Active Jobs</h2>
          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs currently assigned.</p>
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
                 <div className="job-card-details">
                    <h3 className="job-title">Customer Name : {job.customerName}</h3>
                    <p><strong>📞 Phone:</strong> {job.customerPhone}</p>
                    <p><strong>🔧 Work Type:</strong> {job.workType}</p>
                    <p><strong>📝 Reason:</strong> {job.reason}</p>
                    <p><strong>📅 Date/Time:</strong> {new Date(job.datetime).toLocaleString()}</p>
                    <p><strong>📍 Location:</strong> {job.location}</p>
                    <p><strong>⚠️ Priority:</strong> {job.priority}</p>
                    <p><strong>🗒️ Remarks:</strong> {job.remarks}</p>
                    <p className={`job-status ${job.status.toLowerCase()}`}>
                    <strong>🔄 Status:</strong> {job.status}
                    </p>
                </div>

                <div className="button-group">
                  {job.status === 'Assigned' && (
                    <>
                      <button
                        onClick={() => handleAccept(job._id)}
                        className="btn accept-btn"
                        disabled={loadingJobId === job._id && loadingActionType === 'accept'}
                      >
                        {loadingJobId === job._id && loadingActionType === 'accept' ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectModal(job._id)}
                        className="btn reject-btn"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {job.status === 'Accepted' && (
                    <button
                      onClick={() => openUploadModal(job._id, 'start')}
                      className="btn progress-btn"
                    >
                      Start Work
                    </button>
                  )}

                  {job.status === 'In Progress' && (
                    <button
                      onClick={() => openUploadModal(job._id, 'complete')}
                      className="btn complete-btn"
                    >
                      Complete Work
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Reason for Rejection</h3>
                <textarea
                  className='newtext'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                  required
                />
                <button className='gtbut' onClick={submitReject}>Submit</button>
                <button className='redbut' onClick={() => setShowRejectModal(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {uploadModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{uploadType === 'start' ? 'Start Work' : 'Complete Work'}</h3>
                <input type="file" onChange={(e) => setUploadImage(e.target.files[0])} />
                <textarea
                  className='newtext'
                  placeholder="Remarks"
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                />
                <button className='gtbut' onClick={submitUpload}>Submit</button>
                <button className='redbut' onClick={() => setUploadModal(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}