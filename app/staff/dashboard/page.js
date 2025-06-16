

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import { FilePlus, Briefcase, CheckCircle2 } from 'lucide-react';

export default function StaffDashboard() {
  const [user, setUser] = useState({ username: 'StaffUser' }); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
  }, [router]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <Sidebar role="staff" />

      <main style={{
        flex: 1,
        backgroundColor: '#f9f9f9',
        marginLeft: 240,
        paddingTop: 60,
        overflowY: 'auto',
        height: '100vh'
      }}>
        <Topbar username={user.username} />

        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          padding: '20px 50px',
          marginTop: 20,
        }}>
        
          <div style={{
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
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div>
              <div style={{ fontSize: 50 }}>0</div>
              <div>Jobs Created</div>
            </div>
            <FilePlus size={50} />
          </div>

        
          <div style={{
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
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div>
              <div style={{ fontSize: 50 }}>0</div>
              <div>Total Jobs</div>
            </div>
            <Briefcase size={50} />
          </div>

         
          <div style={{
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
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div>
              <div style={{ fontSize: 50 }}>0</div>
              <div>Completed Jobs</div>
            </div>
            <CheckCircle2 size={50} />
          </div>
        </div>
      </main>
    </div>
  );
}