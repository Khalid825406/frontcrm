'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../alljob/all.css';

export default function AllOtherJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(jobId) {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`https://new-crm-sdcn.onrender.com/api/admin/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert('Job deleted successfully');
        fetchJobs();
      } else {
        alert(res.data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Error deleting job');
    }
  }

  function getStatus(job) {
    if (job.approved) return 'Approved';
    if (job.rejected) return 'Rejected';
    return 'Pending';
  }

  function getStatusColor(status) {
    if (status === 'Approved') return '#4CAF50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
  }

  // 🔍 Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const status = getStatus(job).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      job.customerName?.toLowerCase().includes(query) ||
      job.customerPhone?.toLowerCase().includes(query) ||
      job.workType?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query);

    const matchesStatus = !statusFilter || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // 📄 Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role="admin" />
      <main
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          marginLeft: 240,
          paddingTop: 60,
          padding: 20,
          overflowY: 'auto',
        }}
        className="responvice"
      >
        <Topbar username="Admin" />
        <div style={{ maxWidth: 1400, margin: '60px auto' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
              overflowX: 'auto',
            }}
          >
            {/* 🔍 Search + Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Search by name, phone, work type, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to page 1 on new search
                }}
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  width: '60%',
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // reset to page 1 on new filter
                }}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {loading ? (
              <p style={{ padding: 20 }}>Loading jobs...</p>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#293ace' }}>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Phone</th>
                      <th style={thStyle}>Work Type</th>
                      <th style={thStyle}>Reason</th>
                      <th style={thStyle}>Date/Time</th>
                      <th style={thStyle}>Location</th>
                      <th style={thStyle}>Priority</th>
                      <th style={thStyle}>Remarks</th>
                      <th style={thStyle}>Created By</th>
                      <th style={thStyle}>Images</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Created At</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.length === 0 ? (
                      <tr>
                        <td colSpan="13" style={{ textAlign: 'center', padding: 20 }}>
                          No jobs found.
                        </td>
                      </tr>
                    ) : (
                      currentJobs.map((job) => (
                        <tr key={job._id}>
                          <td style={tdStyle}>{job.customerName}</td>
                          <td style={tdStyle}>{job.customerPhone}</td>
                          <td style={tdStyle}>{job.workType}</td>
                          <td style={tdStyle}>{job.reason}</td>
                          <td style={tdStyle}>{new Date(job.datetime).toLocaleString()}</td>
                          <td style={tdStyle}>{job.location}</td>
                          <td style={tdStyle}>{job.priority}</td>
                          <td style={tdStyle}>{job.remarks}</td>
                          <td style={tdStyle}>
                            {job.createdBy?.username
                              ? `${job.createdBy.username} (${job.createdBy.role})`
                              : 'N/A'}
                          </td>
                          <td style={tdStyle}>
                            {Array.isArray(job.images) && job.images.length > 0
                              ? `${job.images.length} image(s)`
                              : 'No images'}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              color: getStatusColor(getStatus(job)),
                              fontWeight: 600,
                            }}
                          >
                            <span className='mystay'>{getStatus(job)}</span>
                          </td>
                          <td style={tdStyle}>{new Date(job.createdAt).toLocaleString()}</td>
                          <td style={tdStyle}>
                            <button
                              onClick={() => handleDelete(job._id)}
                              style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                borderRadius: 4,
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* 📄 Pagination Buttons */}
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '6px 12px', borderRadius: 4 }}
                  >
                    Prev
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '6px 12px', borderRadius: 4 }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  fontWeight: 600,
  fontSize: 14,
  whiteSpace: 'nowrap',
  color: '#fff'
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: 14,
  whiteSpace: 'nowrap',
};