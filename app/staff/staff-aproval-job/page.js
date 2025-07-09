'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../staff-aproval-job/staffaproval.css';
import { X } from 'lucide-react';

export default function ApprovedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    fetchApprovedJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, priorityFilter, jobs]);

 const fetchApprovedJobs = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const approved = res.data.filter((job) => {
      const timeline = job.statusTimeline || [];
      const lastStatus = timeline.length > 0 ? timeline[timeline.length - 1].status : null;

      return job.approved && !job.rejected && (!job.assignedTo || lastStatus === 'Rejected');
    });

    setJobs(approved);
  } catch (err) {
    console.error(err);
    alert('❌ Failed to fetch approved jobs');
  } finally {
    setLoading(false);
  }
};


  const filterJobs = () => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customerPhone.includes(searchTerm) ||
        job.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === 'All' || job.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesPriority;
    });

    setFilteredJobs(filtered);
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
      alert('❌ Failed to fetch technicians');
    }
  };

  const handleAssign = (jobId) => {
    setSelectedJobId(jobId);
    fetchTechnicians();
  };

  const handleAssignTechnician = async (technicianId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://new-crm-sdcn.onrender.com/api/admin/assign-job',
        { jobId: selectedJobId, technicianId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Assigned successfully');
      setShowModal(false);
      setSearchTerm('');
      fetchApprovedJobs();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to assign technician');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role="staff" />
      <main className="main-container">
        <Topbar username="newstaf" />
        <div className="content-wrapper">

          <div className="filters">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <JobCards jobs={filteredJobs} loading={loading} onAssign={handleAssign} />
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Select Technician</h3>

              <input
                type="text"
                placeholder="Search technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <ul className="technician-list">
                {technicians
                  .filter((tech) =>
                    tech.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tech.phone.includes(searchTerm)
                  )
                  .map((tech) => (
                    <li key={tech._id}>
                      <div>
                        <div className="tech-info">{tech.username}</div>
                        <div className="tech-phone">{tech.phone}</div>
                      </div>
                      <div>
                        <button className="assign-btn" onClick={() => handleAssignTechnician(tech._id)}>
                          Assign
                        </button>
                       
                      </div>
                    </li>
                  ))}
              </ul>
               <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  <X />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function JobCards({ jobs, loading, onAssign }) {
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (jobs.length === 0) return <p style={{ padding: 20 }}>No jobs found.</p>;

  return (
    <div className="card-container">
      {jobs.map((job) => {
        const isRejected = job.statusTimeline?.some((s) => s.status === 'Rejected');
        return (
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
              <p><strong>Department:</strong> {job.Department}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Date/Time:</strong> {new Date(job.datetime).toLocaleString()}</p>
              <p><strong>Reason:</strong> {job.reason}</p>
              <p><strong>Priority:</strong> {job.priority}</p>
              <p><strong>Remarks:</strong> {job.remarks}</p>
              <p className="job-status">Status: {isRejected ? 'Rejected by Technician' : 'Approved'}</p>
              <button className="assign-button" onClick={() => onAssign(job._id)}>
                {isRejected ? 'Reassign Technician' : 'Assign'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}