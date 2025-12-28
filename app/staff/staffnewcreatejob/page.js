'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './staff.module.css';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';



export default function NewCreateJobPage() {
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

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionBoxRef = useRef(null);
  const [username, setUsername] = useState('');



  // Fetch suggestions
  const handleCustomerNameChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, customerName: value }));

    if (value.length > 1) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/jobs/customers?query=${value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Autofill on suggestion click
  const handleSuggestionSelect = (job) => {
    setFormData({
      customerName: job.customerName,
      customerPhone: job.customerPhone || '',
      workType: job.workType || '',
      Department:job.Department || '',
      reason: job.reason || '',
      datetime: job.datetime ? job.datetime.slice(0, 16) : '',
      location: job.location || '',
      priority: job.priority || 'Medium',
      remarks: job.remarks || '',
      images: [],
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        if (key === 'images') {
          value.forEach((file) => data.append('images', file));
        } else {
          data.append(key, value);
        }
      });

      const token = localStorage.getItem('token');
      await axios.post('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/jobs', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Job submitted successfully for admin approval');

      setFormData({
        customerName: '',
        customerPhone: '',
        workType: '',
        Department:'',
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

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/staff/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.name); // or res.data.username depending on response
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);


  return (
    <div className={styles.pageWrapper}>
      <Sidebar role="staff" />

      <div className={styles.mainContent}>
        <Topbar username={username} />

        <main className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Customer Name with Suggestions */}
            <div style={{ position: 'relative' }} ref={suggestionBoxRef}>
              <label className={styles.label}>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleCustomerNameChange}
                required
                className={styles.input}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionList}>
                  {suggestions.map((sug) => (
                    <li
                      key={sug._id}
                      onClick={() => handleSuggestionSelect(sug)}
                      className={styles.suggestionItem}
                    >
                      {sug.customerName}{' '}
                      <span style={{ color: '#888', fontSize: '0.8rem' }}>
                        ({sug.location})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
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
                list="workTypeOptions"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Type or select"
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

             <div>
              <label className={styles.label}>Department</label>
              <input
                list="Department"
                name="Department"
                value={formData.Department}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Choose the Department"
              />
              <datalist id="Department">
                <option value="Accounts" />
                <option value="Purchase" />
                <option value=" Ware house" />
                <option value="Head Office" />
              </datalist>
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