'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/app/components/AdminLayout';
import styles from './NewCreateJobPage.module.css';

export default function NewCreateJobPage() {
  const [form, setForm] = useState({
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
  const suggestionRef = useRef(null);

  /* ---------- autocomplete ---------- */
  const handleCustomerType = async (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, customerName: val }));
    if (val.length < 2) return setSuggestions([]);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `https://new-crm-sdcn.onrender.com/api/jobs/customers?query=${val}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch {
      toast.error('Could not fetch customers');
    }
  };

  const pickCustomer = (c) => {
    setForm({
      ...form,
      customerName: c.customerName,
      customerPhone: c.customerPhone || '',
      workType: c.workType || '',
      Department: c.Department || '',
      reason: c.reason || '',
      datetime: c.datetime ? c.datetime.slice(0, 16) : '',
      location: c.location || '',
      priority: c.priority || 'Medium',
      remarks: c.remarks || '',
      images: [],
    });
    setShowSuggestions(false);
  };

  useEffect(() => {
    const outside = (e) =>
      suggestionRef.current && !suggestionRef.current.contains(e.target) && setShowSuggestions(false);
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  /* ---------- change handlers ---------- */
  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFiles = (e) =>
    setForm((f) => ({ ...f, images: Array.from(e.target.files) }));

  /* ---------- submit ---------- */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') v.forEach((file) => data.append('images', file));
        else data.append(k, v);
      });

      const token = localStorage.getItem('token');
      await axios.post('https://new-crm-sdcn.onrender.com/api/jobs', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Job submitted for approval');
      setForm({
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
    } catch {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <AdminLayout>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Create New Job</h1>
          <p className={styles.subtitle}>Fill in the details below to raise a job for admin approval.</p>
        </header>

        <form onSubmit={submit} className={styles.grid}>
          {/* Customer Name */}
          <div className={styles.cell} ref={suggestionRef}>
            <label className={styles.label}>Customer Name *</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleCustomerType}
              required
              className={styles.input}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((c) => (
                  <li key={c._id} onClick={() => pickCustomer(c)} className={styles.suggestion}>
                    {c.customerName}
                    <span className={styles.hint}>{c.location}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Phone */}
          <div className={styles.cell}>
            <label className={styles.label}>Customer Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handle}
              required
              className={styles.input}
            />
          </div>

          {/* Work Type */}
          <div className={styles.cell}>
            <label className={styles.label}>Work Type *</label>
            <input
              list="workTypes"
              name="workType"
              value={form.workType}
              onChange={handle}
              required
              className={styles.input}
            />
            <datalist id="workTypes">
              {['Meet', 'Delivery', 'Collect', 'Return', 'Payment-Collect', 'Refund', 'Replacement', 'New Client Visit', 'For Service'].map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>
          </div>

          {/* Department */}
          <div className={styles.cell}>
            <label className={styles.label}>Department *</label>
            <input
              list="departments"
              name="Department"
              value={form.Department}
              onChange={handle}
              required
              className={styles.input}
            />
            <datalist id="departments">
              {['Accounts', 'Purchase', 'Warehouse', 'Head Office'].map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          {/* Date / Time */}
          <div className={styles.cell}>
            <label className={styles.label}>Date / Time *</label>
            <input
              type="datetime-local"
              name="datetime"
              value={form.datetime}
              onChange={handle}
              required
              className={styles.input}
            />
          </div>

          {/* Location */}
          <div className={styles.cell}>
            <label className={styles.label}>Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handle}
              required
              className={styles.input}
            />
          </div>

          {/* Priority */}
          <div className={styles.cell}>
            <label className={styles.label}>Priority</label>
            <select name="priority" value={form.priority} onChange={handle} className={styles.select}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Images */}
          <div className={styles.cell}>
            <label className={styles.label}>Upload Images</label>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className={styles.input} />
          </div>

          {/* Reason */}
          <div className={styles.cell}>
            <label className={styles.label}>Reason *</label>
            <input
              name="reason"
              value={form.reason}
              onChange={handle}
              required
              className={styles.input}
            />
          </div>

          {/* Remarks */}
          <div className={styles.cellFull}>
            <label className={styles.label}>Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handle}
              rows={4}
              className={styles.textarea}
            />
          </div>

          {/* Submit */}
          <div className={styles.cellFull}>
            <button type="submit" disabled={loading} className={styles.submit}>
              {loading ? 'Submitting…' : 'Submit Job'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}