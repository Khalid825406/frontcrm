'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './staff.module.css';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function NewCreateJobPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    workType: '',
    reason: '',
    datetime: '',
    location: '',
    priority: 'Medium',
    remarks: '',
    images: [],
  });

  const [loading, setLoading] = useState(false);

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
  setLoading(true);
  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => data.append('images', file));
      } else {
        data.append(key, value);
      }
    });

    const token = localStorage.getItem('token'); // 🔐 Get token

    await axios.post('https://new-crm-sdcn.onrender.com/api/jobs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // 🔐 Add token here
      },
    });

    alert('Job submitted successfully for admin approval');
    setFormData({
      customerName: '',
      customerPhone: '',
      workType: '',
      reason: '',
      datetime: '',
      location: '',
      priority: 'Medium',
      remarks: '',
      images: [],
    });
  } catch (error) {
    console.error('Error submitting job:', error);
    alert(error.response?.data?.message || 'Error creating job');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.pageWrapper}>
      <Sidebar role="staff"/>  

      <div className={styles.mainContent}>

       <Topbar username="Khalid" />
      
       
        <main className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* The form fields remain the same */}
            <div>
              <label className={styles.label}>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Customer Phone</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Work Type</label>
              <input
                type="text"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Reason</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Date / Time</label>
              <input
                type="datetime-local"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className={styles.label}>Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={styles.input}
              />
            </div>

            <div className={styles.fullWidth}>
              <label className={styles.label}>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={4}
                className={styles.textarea}
              />
            </div>

            <div className={styles.fullWidth}>
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Submitting...' : 'Submit Job'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}