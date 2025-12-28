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

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-content">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line subtitle"></div>
      </div>
      <div className="skeleton-icon"></div>
    </div>
  );
}

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

        const resUser = await axios.get(
          'https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/user/dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resUser.data?.user && resUser.data.role === 'technician') {
          setUsername(resUser.data.user);
        }

        const resJobs = await axios.get(
          'https://new-crm-medical-guz9ryfr8-kahlid098s-projects.vercel.app/api/admin/assigned-jobs-status',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setJobs(Array.isArray(resJobs.data) ? resJobs.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const activeJobs = jobs.filter(j =>
    ['Assigned', 'Accepted', 'In Progress'].includes(j.status)
  );

  return (
    <div className="tech-dashboard-wrapper">
      <Sidebar role="technician" />
      <main className="maintech">
        <Topbar username={username} />

        <div className="newtech">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <Link href="/technician/jobs" className="dashboard-link">
                <div className="dashboard-card green">
                  <div>
                    <div className="card-number">{activeJobs.length}</div>
                    <div>My Assigned Jobs</div>
                  </div>
                  <Hammer size={50} />
                </div>
              </Link>

              <Link href="/technician/dashboard" className="dashboard-link">
                <div className="dashboard-card orange">
                  <div>
                    <div className="card-number">{jobs.length}</div>
                    <div>Total Jobs</div>
                  </div>
                  <Briefcase size={50} />
                </div>
              </Link>

              <Link href="/technician/TechnicianCompleted" className="dashboard-link">
                <div className="dashboard-card blue">
                  <div>
                    <div className="card-number">{completedJobs.length}</div>
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