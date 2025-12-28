'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../alljob/all.css';
import { SquarePen, Trash2, Search, Filter, Download, RefreshCw } from 'lucide-react';
import EditJobModal from './EditJobModal';
import {toast} from 'react-hot-toast'
import AdminLayout from '@/app/components/AdminLayout';

export default function AllOtherJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const jobsPerPage = 10;
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/all-jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched Jobs:', res.data);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(jobId) {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success('Job deleted successfully');
        fetchJobs();
      } else {
        toast.error(res.data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Error deleting job');
    }
  }

  async function handleDeleteSelected() {
    if (selectedJobIds.length === 0) {
      toast.error('No jobs selected');
      return;
    }

    const confirmDelete = window.confirm(`Delete ${selectedJobIds.length} selected job(s)?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      for (const jobId of selectedJobIds) {
        await axios.delete(`https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      toast.success('Selected jobs deleted');
      setSelectedJobIds([]);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Error deleting selected jobs');
    }
  }

  function toggleJobSelection(jobId) {
    setSelectedJobIds((prevSelected) =>
      prevSelected.includes(jobId)
        ? prevSelected.filter((id) => id !== jobId)
        : [...prevSelected, jobId]
    );
  }

  function toggleSelectAll() {
    const visibleJobIds = currentJobs.map((job) => job._id);
    const allSelected = visibleJobIds.every((id) => selectedJobIds.includes(id));
    setSelectedJobIds(allSelected ? [] : visibleJobIds);
  }

  function getStatus(job) {
    if (job.approved) return 'Approved';
    if (job.rejected) return 'Rejected';
    return 'Pending';
  }

  function getStatusColor(status) {
    if (status === 'Approved') return '#10b981';
    if (status === 'Rejected') return '#ef4444';
    return '#f59e0b';
  }

  function getStatusBgColor(status) {
    if (status === 'Approved') return '#dcfce7';
    if (status === 'Rejected') return '#fee2e2';
    return '#fef3c7';
  }

  const filteredJobs = jobs
    .filter((job) => {
      const status = getStatus(job).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        job.customerName?.toLowerCase().includes(query) ||
        job.customerPhone?.toLowerCase().includes(query) ||
        job.workType?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <AdminLayout>
      <div className="job-management-container">
        <main className="main-content">
          <div className="content-wrapper">
            <div className="page-header">
              <h1 className="page-title">Job Management</h1>
              <button onClick={fetchJobs} className="refresh-btn">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="card">
              {/* Search and Filter Section */}
              <div className="filter-section">
                <div className="search-box">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, work type, location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input"
                  />
                </div>
                
                <div className="filter-controls">
                  <div className="filter-group">
                    <Filter size={20} className="filter-icon" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="filter-select"
                    >
                      <option value="">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <span className="results-count">
                    {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedJobIds.length === 0}
                  className={`delete-selected-btn ${selectedJobIds.length === 0 ? 'disabled' : ''}`}
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedJobIds.length})
                </button>
              </div>

              {/* Table Section */}
              {loading ? (
                <SkeletonTableRow />
              ) : (
                <>
                  <div className="table-container">
                    <table className="job-table">
                      <thead>
                        <tr className="table-header">
                          <th className="checkbox-cell">
                            <input
                              type="checkbox"
                              checked={
                                currentJobs.length > 0 &&
                                currentJobs.every((job) => selectedJobIds.includes(job._id))
                              }
                              onChange={toggleSelectAll}
                              className="checkbox"
                            />
                          </th>
                          <th className="sortable-header">Customer</th>
                          <th className="sortable-header">Phone</th>
                          <th className="sortable-header">Work Type</th>
                          <th className="sortable-header">Reason</th>
                          <th className="sortable-header">Date/Time</th>
                          <th className="sortable-header">Location</th>
                          <th className="sortable-header">Priority</th>
                          <th className="sortable-header">Remarks</th>
                          <th className="sortable-header">Created By</th>
                          <th className="sortable-header">Status</th>
                          <th className="sortable-header">Created At</th>
                          <th className="action-header">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentJobs.length === 0 ? (
                          <tr>
                            <td colSpan="13" className="no-data-cell">
                              <div className="no-data-message">
                                <i className="fas fa-inbox"></i>
                                <p>No jobs found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentJobs.map((job) => (
                            <tr key={job._id} className="table-row">
                              <td className="checkbox-cell">
                                <input
                                  type="checkbox"
                                  checked={selectedJobIds.includes(job._id)}
                                  onChange={() => toggleJobSelection(job._id)}
                                  className="checkbox"
                                />
                              </td>
                              <td className="customer-cell">
                                <div className="customer-info">
                                  <span className="customer-name">{job.customerName}</span>
                                </div>
                              </td>
                              <td className="phone-cell">{job.customerPhone}</td>
                              <td className="work-type-cell">
                                <span className="work-type-badge">{job.workType}</span>
                              </td>
                              <td className="reason-cell">{job.reason}</td>
                              <td className="datetime-cell">
                                {new Date(job.datetime).toLocaleString()}
                              </td>
                              <td className="location-cell">{job.location}</td>
                              <td className="priority-cell">
                                <span className={`priority-badge ${job.priority?.toLowerCase()}`}>
                                  {job.priority}
                                </span>
                              </td>
                              <td className="remarks-cell" title={job.remarks}>
                                {job.remarks?.split(' ').slice(0, 5).join(' ') +
                                  (job.remarks?.split(' ').length > 5 ? '...' : '')}
                              </td>
                              <td className="created-by-cell">
                                {job.createdBy?.username
                                  ? `${job.createdBy.username} (${job.createdBy.role})`
                                  : 'N/A'}
                              </td>
                              <td className="status-cell">
                                <span 
                                  className="status-badge"
                                  style={{
                                    backgroundColor: getStatusBgColor(getStatus(job)),
                                    color: getStatusColor(getStatus(job))
                                  }}
                                >
                                  {getStatus(job)}
                                </span>
                              </td>
                              <td className="created-at-cell">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </td>
                              <td className="action-cell">
                                <div className="action-buttons-cell">
                                  <button 
                                    onClick={() => setEditingJob(job)} 
                                    className="edit-btn"
                                    title="Edit job"
                                  >
                                    <SquarePen size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(job._id)} 
                                    className="delete-btn"
                                    title="Delete job"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      
                      <div className="pagination-info">
                        <span>Page {currentPage} of {totalPages}</span>
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSuccess={fetchJobs}
        />
      )}
    </AdminLayout>
  );
}

function SkeletonTableRow({ rowCount = 8, colCount = 13 }) {
  return (
    <div className="table-container">
      <table className="job-table">
        <thead>
          <tr className="table-header">
            {Array.from({ length: colCount }).map((_, idx) => (
              <th key={idx} className="skeleton-header"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex} className="skeleton-row">
              {Array.from({ length: colCount }).map((_, colIndex) => (
                <td key={colIndex} className="skeleton-cell">
                  <div className="skeleton-line" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}