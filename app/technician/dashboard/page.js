'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../dashboard/techdash.css';
import { Hammer, Briefcase, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { requestForToken } from '../../firebase-messaging';

export default function TechnicianDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    const fetchData = async () => {
      try {
        await requestForToken();

        const resUser = await axios.get('https://new-crm-sdcn.onrender.com/api/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resUser.data && resUser.data.user && resUser.data.role === 'technician') {
          setUsername(resUser.data.user);
        }

        const resJobs = await axios.get(
          'https://new-crm-sdcn.onrender.com/api/admin/assigned-jobs-status',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allJobs = Array.isArray(resJobs.data) ? resJobs.data : [];
        setJobs(allJobs);
      } catch (error) {
        console.error('Error fetching data:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const activeJobs = jobs.filter((j) =>
    ['Assigned', 'Accepted', 'In Progress'].includes(j.status)
  );

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <Sidebar role="technician" />
      <main
        className="maintech"
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
          className="newtech"
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            padding: '20px 50px',
            marginTop: 20,
          }}
        >
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Active Jobs */}
              <Link href="/technician/jobs" className="dashboard-link">
                <div className="dashboard-card" style={{ backgroundColor: '#10b981' }}>
                  <div>
                    <div style={{ fontSize: 50 }}>{activeJobs.length}</div>
                    <div>My Assigned Jobs</div>
                  </div>
                  <Hammer size={50} />
                </div>
              </Link>

              {/* Total Jobs */}
              <Link href="/technician/dashboard" className="dashboard-link">
                <div className="dashboard-card" style={{ backgroundColor: '#f97316' }}>
                  <div>
                    <div style={{ fontSize: 50 }}>{jobs.length}</div>
                    <div>Total Jobs</div>
                  </div>
                  <Briefcase size={50} />
                </div>
              </Link>

              {/* Completed Jobs */}
              <Link href="/technician/TechnicianCompleted" className="dashboard-link">
                <div className="dashboard-card" style={{ backgroundColor: '#3b82f6' }}>
                  <div>
                    <div style={{ fontSize: 50 }}>{completedJobs.length}</div>
                    <div>Completed Jobs</div>
                  </div>
                  <CheckCircle2 size={50} />
                </div>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ✅ Skeleton loader card
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-left">
        <div className="skeleton-amount"></div>
        <div className="skeleton-label"></div>
      </div>
      <div className="skeleton-icon"></div>
    </div>
  );
}
