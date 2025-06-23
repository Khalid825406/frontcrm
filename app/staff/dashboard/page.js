'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../dashboard/newstaff.css'
import { Hammer , Briefcase, CheckCircle2 } from 'lucide-react';

export default function StaffDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    const fetchData = async () => {
      try {
        // Username
        const resUser = await axios.get('https://new-crm-sdcn.onrender.com/api/staff/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(resUser.data.name);

        // Jobs
        const resJobs = await axios.get('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allJobs = Array.isArray(resJobs.data) ? resJobs.data : [];
        setJobs(allJobs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const assignedOrInProgressJobs = jobs.filter(j => j.status === 'Accepted' || j.status === 'In Progress');

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <Sidebar role="staff" />
      <main
        className='newstas'
        style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          marginLeft: 240,
          paddingTop: 60,
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <Topbar username={username} />

        <div
        className='newmseed'
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            padding: '20px 50px',
            marginTop: 20,
          }}
        >
          {/* Jobs Status */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#10b981',
              padding: 20,
              borderRadius: 10,
              color: '#fff',
              fontWeight: 'bold',
              minWidth: 250,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <div>
              <div style={{ fontSize: 50 }}>{assignedOrInProgressJobs.length}</div>
              <div>Jobs In Progress</div>
            </div>
            <Hammer  size={50} />
          </div>

          {/* Total Jobs */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#f97316',
              padding: 20,
              borderRadius: 10,
              color: '#fff',
              fontWeight: 'bold',
              minWidth: 250,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <div>
              <div style={{ fontSize: 50 }}>{jobs.length}</div>
              <div>Total Jobs</div>
            </div>
            <Briefcase size={50} />
          </div>

          {/* Completed Jobs */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#3b82f6',
              padding: 20,
              borderRadius: 10,
              color: '#fff',
              fontWeight: 'bold',
              minWidth: 250,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <div>
              <div style={{ fontSize: 50 }}>{completedJobs.length}</div>
              <div>Completed Jobs</div>
            </div>
            <CheckCircle2 size={50} />
          </div>
        </div>
      </main>
    </div>
  );
}