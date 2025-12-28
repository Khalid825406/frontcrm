import { useEffect, useState } from 'react';
import axios from 'axios';
import './EditJobModal.css';
import toast, {taost} from 'react-hot-toast'

export default function EditJobModal({ job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    workType: '',
    Department: '',
    reason: '',
    datetime: '',
    location: '',
    priority: 'Medium',
    remarks: '',
    images: [],
  });

  useEffect(() => {
    if (job) {
      setFormData({
        customerName: job.customerName || '',
        customerPhone: job.customerPhone || '',
        workType: job.workType || '',
        Department: job.Department || '',
        reason: job.reason || '',
        datetime: job.datetime ? job.datetime.slice(0, 16) : '',
        location: job.location || '',
        priority: job.priority || 'Medium',
        remarks: job.remarks || '',
        images: [],
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file) => data.append('images', file));
        } else {
          data.append(key, value);
        }
      });

      await axios.put(
        `https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/jobs/${job._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Job updated successfully')
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating job');
    }
  };

  return (
    <div className="edit-overlay" onClick={(e) => {
      if (e.target.classList.contains('edit-overlay')) onClose();
    }}>
      <div className="edit-modal">
        <button className="edit-close-button" onClick={onClose}>×</button>
        <h2 className="edit-title">Update Job</h2>
        <form onSubmit={handleSubmit} className="edit-form-grid">
          <div className="edit-form-group">
            <label className="edit-label">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Customer Phone</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Work Type</label>
            <input
              list="workTypeOptions"
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="edit-input"
              required
            />
            <datalist id="workTypeOptions">
              <option value="Meet" />
              <option value="Delivery" />
              <option value="Collect" />
              <option value="Return" />
              <option value="Payment-Collect" />
              <option value="Refund" />
              <option value="Replacement" />
              <option value="New Client Visit" />
              <option value="For Service" />
            </datalist>
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Department</label>
            <input
              list="Department"
              name="Department"
              value={formData.Department}
              onChange={handleChange}
              className="edit-input"
              required
            />
            <datalist id="Department">
              <option value="Accounts" />
              <option value="Purchase" />
              <option value="Ware house" />
              <option value="Head Office" />
            </datalist>
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Date / Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="edit-input"
              required
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="edit-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="edit-form-group">
            <label className="edit-label">Upload New Images (optional)</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="edit-input"
            />
          </div>

          <div className="edit-form-group full-width">
            <label className="edit-label">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={4}
              className="edit-textarea"
            />
          </div>

          <div className="edit-form-group full-width edit-button-group">
            <button type="submit" className="edit-button update-btn">
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}