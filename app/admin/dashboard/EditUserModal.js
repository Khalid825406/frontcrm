'use client';

import { useState } from 'react';
import axios from 'axios';
import './Edituser.css';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditUserModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/user/${user._id}`, {
        username,
        phone,
      });
      toast.success('User updated successfully ✅');
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      toast.error('Failed to update user ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter phone"
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleSubmit} disabled={loading} className="save-btn">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}