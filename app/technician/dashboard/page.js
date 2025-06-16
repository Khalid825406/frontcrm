// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Sidebar from '../../components/Sidebar'; // path adjust karo apne project structure ke hisaab se

// function Topbar({ username }) {
//   const router = useRouter();

//   const logout = () => {
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <header style={{
//       height: 60,
//       backgroundColor: '#1f2937',
//       color: 'white',
//       padding: '0 20px',
//       position: 'fixed',
//       top: 0,
//       left: 240,
//       right: 0,
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
//       boxSizing: 'border-box',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//       zIndex: 1000,
//     }}>
//       <div style={{ fontSize: 16 }}>
//         Welcome, <b>{username || '...'}</b>
//       </div>
//       <button
//         onClick={logout}
//         style={{
//           backgroundColor: '#ef4444',
//           border: 'none',
//           padding: '8px 15px',
//           borderRadius: 5,
//           color: 'white',
//           cursor: 'pointer',
//           fontWeight: 'bold',
//           fontSize: 14,
//           transition: 'background-color 0.3s ease',
//         }}
//         onMouseOver={e => e.currentTarget.style.backgroundColor = '#dc2626'}
//         onMouseOut={e => e.currentTarget.style.backgroundColor = '#ef4444'}
//       >
//         Logout
//       </button>
//     </header>
//   );
// }

// export default function TechnicianDashboard() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return router.push('/login');

//     axios.get('https://new-crm-sdcn.onrender.com/api/user/dashboard', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then(res => {
//       console.log(res.data);
//       if (res.data.role !== 'technician') {
//         router.push(`/${res.data.role}/dashboard`);
//       } else {
//         setUser(res.data.user);
//       }
//     })
//     .catch(() => router.push('/login'));
//   }, [router]);

//   if (!user) return <p style={{ marginLeft: 260, paddingTop: 80 }}>Loading...</p>;


  
//   return (
//     <div style={{ display: 'flex', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
//       <Sidebar role="technician" />

//       <main style={{
//         marginLeft: 240,
//         marginTop: 60,
//         padding: 20,
//         flex: 1,
//         backgroundColor: '#f9f9f9',
//         minHeight: '100vh',
//         boxSizing: 'border-box',
//         overflowY: 'auto'
//       }}>
//         <Topbar username={user} />

//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 30, maxWidth: 930, marginTop: 60, marginLeft: 54 }}>
              
        
          
        
                 
        
//                     {/* ✅ Completed Jobs */}
//                     <div
//                       style={{
//                         backgroundColor: '#059669',
//                       color: 'white',
//                         padding: 20,
//                         borderRadius: 10,
//                         fontWeight: 'bold',
//                         flex: 1,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         minWidth: 250,
//                           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//                       }}
//                       title="Completed Jobs"
//                     >
//                       <div style={{ width: 202 }}>
//                         <div style={{ fontSize: 60 }}>{}</div>
//                         <div>Completed Jobs</div>
//                       </div>
//                       <div>
//                         <CheckCircle style={{ width: 54, height: 54 }} />
//                       </div>
//                     </div>
        
        
//           {/* ✅ All Jobs */}
//               <div
//                 style={{
//                 backgroundColor: '#f43f5e',
//                 color: 'white',
//                   padding: 20,
//                   borderRadius: 10,
//                   fontWeight: 'bold',
//                   flex: 1,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   minWidth: 250,
//                     boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//                 }}
//                 title="All Jobs"
//               >
//                 <div style={{ width: 202 }}>
//                   <div style={{ fontSize: 60 }}>{}</div>
//                   <div>All Jobs</div>
//                 </div>
//                 <div>
//                   <Briefcase style={{ width: 54, height: 54 }} />
//                 </div>
              
                
//               </div>
        
       
        
        
//         </div>

//         <h1 style={{ marginTop: 20 }}>Technician Dashboard</h1>
//         <p>Welcome, <b>{user}</b></p>

//         <h3>Your Assigned Jobs:</h3>
//         <ul style={{ padding: 0, listStyle: 'none' }}>
//           {/* Jobs data will come here */}
//           <li>No jobs assigned</li>
//         </ul>
//       </main>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Briefcase, CheckCircle } from 'lucide-react';

function Topbar({ username }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header style={{
      height: 60,
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '0 20px',
      position: 'fixed',
      top: 0,
      left: 240,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      boxSizing: 'border-box',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 1000,
    }}>
      <div>Welcome, <b>{username || '...'}</b></div>
      <button
        onClick={logout}
        style={{
          backgroundColor: '#ef4444',
          border: 'none',
          padding: '8px 15px',
          borderRadius: 5,
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 14
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#dc2626'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#ef4444'}
      >
        Logout
      </button>
    </header>
  );
}

export default function TechnicianDashboard() {
  const router = useRouter();

  const [user, setUser] = useState('TechnicianUser'); // dummy username

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
  }, [router]);

  // Dummy data
  const completedJobsCount = 0;
  const allJobsCount = 0;

  return (
    <div style={{ display: 'flex', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <Sidebar role="technician" />

      <main style={{
        marginLeft: 240,
        marginTop: 60,
        padding: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <Topbar username={user} />

        {/* Summary Boxes */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 30,
          maxWidth: 930,
          marginTop: 60,
          marginLeft: 54
        }}>

          {/* ✅ Completed Jobs */}
          <div style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: 20,
            borderRadius: 10,
            fontWeight: 'bold',
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: 250,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
            title="Completed Jobs"
          >
            <div style={{ width: 202 }}>
              <div style={{ fontSize: 60 }}>{completedJobsCount}</div>
              <div>Completed Jobs</div>
            </div>
            <CheckCircle style={{ width: 54, height: 54 }} />
          </div>

          {/* ✅ All Jobs */}
          <div style={{
            backgroundColor: '#f43f5e',
            color: 'white',
            padding: 20,
            borderRadius: 10,
            fontWeight: 'bold',
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: 250,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
            title="All Jobs"
          >
            <div style={{ width: 202 }}>
              <div style={{ fontSize: 60 }}>{allJobsCount}</div>
              <div>All Jobs</div>
            </div>
            <Briefcase style={{ width: 54, height: 54 }} />
          </div>

        </div>
      </main>
    </div>
  );
}