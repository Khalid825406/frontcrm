  // 'use client';

  // import { useEffect, useState } from 'react';
  // import Sidebar from '../../components/Sidebar';
  // import Topbar from '../../components/Topbar';
  // import { FileClock, UserCheck, Users ,Briefcase ,CheckCircle  } from 'lucide-react';

  // export default function AdminDashboard() {
  //   const [users, setUsers] = useState([]);
  //   const [jobs, setJobs] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  //   async function fetchData() {
  //     setLoading(true);
  //     const token = localStorage.getItem('token');
  //     try {
  //       // Fetch users
  //       const resUsers = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-users', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const dataUsers = await resUsers.json();
  //       setUsers(Array.isArray(dataUsers) ? dataUsers : []);

  //       // Fetch jobs
  //       const resJobs = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const dataJobs = await resJobs.json();
  //       setJobs(Array.isArray(dataJobs) ? dataJobs : []);
  //     } catch (err) {
  //       console.error(err);
  //       alert('Error fetching data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   const pendingUsers = users.filter(u => !u.approved && !u.rejected);
  //   const otherUsers = users.filter(u => u.approved || u.rejected);
  //   const pendingJobs = jobs.filter(j => !j.approved && !j.rejected);
  //   const assignedJobs = jobs.filter(j => j.assignedTechnician);
  //   const completedJobs = jobs.filter(j => j.status === 'Completed');
  //   const approvedJobs = jobs.filter(j => j.approved);




  //   function getStatus(item) {
  //     if (item.approved) return 'Approved';
  //     if (item.rejected) return 'Rejected';
  //     return 'Pending';
  //   }

  //   function getStatusColor(status) {
  //     if (status === 'Approved') return '#4CAF50';
  //     if (status === 'Rejected') return '#f44336';
  //     return '#ff9800';
  //   }

  //   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  //   return (
  //     <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
  //       <Sidebar role="admin" />

  //       <main
  //         style={{
  //           flex: 1,
  //           backgroundColor: '#f9f9f9',
  //           marginLeft: 240,
  //           paddingTop: 60,
  //           overflowY: 'auto',
  //           height: '100vh',
  //           padding: '20px',
  //         }}
  //       >
  //         <Topbar username="Admin" />

      
  //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 30, maxWidth: 930, marginTop: 60, marginLeft: 54 }}>
  //           <div
  //             style={{
  //               backgroundColor: '#3b82f6',
  //               color: '#fff',
  //               padding: 20,
  //               borderRadius: 10,
  //               fontWeight: 'bold',
  //               flex: 1,
  //               display: 'flex',
  //                 boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //             }}
  //             title="Pending user approvals"
  //           >
  //             <div style={{width: 202}}>
  //           <span style={{ fontSize: 60 }}>{pendingUsers.length}</span>
  //           <div>Pending User Approvals</div> 
  //             </div>
  //             <div>
  //               <UserCheck style={{width:54, height:54}}/>
  //             </div>
  //           </div>

  //           <div
  //             style={{
  //                   backgroundColor: '#10b981',
  //             color: 'white',

  //               padding: 20,
  //               borderRadius: 10,
  //               fontWeight: 'bold',
  //               flex: 1,
  //               display: 'flex',
  //                 boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //             }}
  //             title="Pending job approvals"
  //           >
  //             <div style={{width: 202}}>
  //               <div style={{ fontSize: 60 }}>{pendingJobs.length}</div>
  //               <div>Pending Job Approvals</div> 
  //             </div>
  //             <div>
  //               <FileClock style={{width:54, height:54}}/>
  //             </div>
  //           </div>

  //           {/* All Users */}
  //           <div
  //             style={{
  //                 backgroundColor: '#f97316',
  //     color: 'white',
  //               padding: 20,
  //               borderRadius: 10,
  //               fontWeight: 'bold',
  //               flex: 1,
  //               display: 'flex',
  //               justifyContent: 'space-between',
  //                 boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //             }}
  //             title="All Users"
  //           >
  //             <div style={{width: 202}}>
  //               <div style={{ fontSize: 60 }}>{users.length}</div>
  //               <div>All Users</div>
  //             </div>
  //             <div>
  //               <Users style={{ width: 54, height: 54 }} />
  //             </div>
  //           </div>

  //             <div
  //               style={{
  //               backgroundColor: '#8b5cf6',
  //     color: 'white',
  //                 padding: 20,
  //                 borderRadius: 10,
  //                 fontWeight: 'bold',
  //                 flex: 1,
  //                 display: 'flex',
  //                 justifyContent: 'space-between',
  //                 minWidth: 250,
  //                   boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //               }}
  //               title="Assigned Jobs"
  //             >
  //           <div style={{width: 202}}>
  //             <div style={{ fontSize: 60 }}>{assignedJobs.length}</div>
  //             <div>Assigned Jobs</div>
  //           </div>
  //             <div>
  //               <Briefcase style={{ width: 54, height: 54 }} />
  //             </div>
  //           </div>

  //             {/* ✅ Completed Jobs */}
  //   <div
  //     style={{
  //       backgroundColor: '#059669',
  //     color: 'white',
  //       padding: 20,
  //       borderRadius: 10,
  //       fontWeight: 'bold',
  //       flex: 1,
  //       display: 'flex',
  //       justifyContent: 'space-between',
  //       minWidth: 250,
  //         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //     }}
  //     title="Completed Jobs"
  //   >
  //     <div style={{ width: 202 }}>
  //       <div style={{ fontSize: 60 }}>{completedJobs.length}</div>
  //       <div>Completed Jobs</div>
  //     </div>
  //     <div>
  //       <CheckCircle style={{ width: 54, height: 54 }} />
  //     </div>
  //   </div>


  //   {/* ✅ All Jobs */}
  // <div
  //   style={{
  //   backgroundColor: '#f43f5e',
  //   color: 'white',
  //     padding: 20,
  //     borderRadius: 10,
  //     fontWeight: 'bold',
  //     flex: 1,
  //     display: 'flex',
  //     justifyContent: 'space-between',
  //     minWidth: 250,
  //       boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //   }}
  //   title="All Jobs"
  // >
  //   <div style={{ width: 202 }}>
  //     <div style={{ fontSize: 60 }}>{jobs.length}</div>
  //     <div>All Jobs</div>
  //   </div>
  //   <div>
  //     <Briefcase style={{ width: 54, height: 54 }} />
  //   </div>

    
  // </div>

  // {/* ✅ Approved Jobs */}
  // <div
  //   style={{
  //   backgroundColor: '#14b8a6',
  //     color: 'white',
  //     padding: 20,
  //     borderRadius: 10,
  //     fontWeight: 'bold',
  //     flex: 1,
  //     display: 'flex',
  //     justifyContent: 'space-between',
  //     minWidth: 250,
  //       boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  //   }}
  //   title="Approved Jobs"
  // >
  //   <div style={{ width: 202 }}>
  //     <div style={{ fontSize: 60 }}>{approvedJobs.length}</div>
  //     <div>Approved Jobs</div>
  //   </div>
  //   <div>
  //     <CheckCircle style={{ width: 54, height: 54 }} />
  //   </div>
  // </div>


  //         </div>

  //         {/* Other Users Table */}
  //         <SectionTable
  //           title="All Users"
  //           columns={['Username', 'Role', 'Status', 'Number']}
  //           data={otherUsers}
  //           renderRow={(user) => (
  //             <>
  //               <td style={tdStyle}>{user.username}</td>
  //               <td style={tdStyle}>{user.role}</td>
  //               <td style={{ ...tdStyle, color: getStatusColor(getStatus(user)), fontWeight: 600 }}>
  //                 {getStatus(user)}
  //               </td>
  //               <td style={tdStyle}>{user.phone}</td>
  //             </>
  //           )}
  //           emptyMessage="No users found."
  //         />
  //       </main>
  //     </div>
  //   );
  // }

  // function SectionTable({ title, columns, data, renderRow, emptyMessage }) {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: 'white',
  //         padding: 20,
  //         borderRadius: 10,
  //         marginBottom: 40,
  //         boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
  //         maxWidth: 900,
  //         marginLeft: 'auto',
  //         marginRight: 'auto',
  //       }}
  //     >
  //       <h2 style={{ marginBottom: 20 }}>{title}</h2>
  //       <div style={{ overflowX: 'auto' }}>
  //         <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
  //           <thead>
  //             <tr style={{ backgroundColor: '#f2f2f2' }}>
  //               {columns.map((col, idx) => (
  //                 <th key={idx} style={thStyle}>
  //                   {col}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {data.length === 0 ? (
  //               <tr>
  //                 <td colSpan={columns.length} style={{ textAlign: 'center', padding: 20 }}>
  //                   {emptyMessage}
  //                 </td>
  //               </tr>
  //             ) : (
  //               data.map(item => <tr key={item._id}>{renderRow(item)}</tr>)
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   );
  // }

  // const thStyle = {
  //   textAlign: 'left',
  //   padding: '12px',
  //   fontWeight: 600,
  //   fontSize: 14,
  //   backgroundColor: '#f8f8f8',
  //   whiteSpace: 'nowrap',
  // };

  // const tdStyle = {
  //   padding: '10px 12px',
  //   fontSize: 14,
  //   whiteSpace: 'nowrap',
  // };
'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import '../dashboard/AdminDashboard.css';
import {
  FileClock,
  UserCheck,
  Users,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const resUsers = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataUsers = await resUsers.json();
      setUsers(Array.isArray(dataUsers) ? dataUsers : []);

      const resJobs = await fetch('https://new-crm-sdcn.onrender.com/api/admin/all-jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataJobs = await resJobs.json();
      setJobs(Array.isArray(dataJobs) ? dataJobs : []);
    } catch (err) {
      console.error(err);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  const pendingUsers = users.filter(u => !u.approved && !u.rejected);
  const otherUsers = users.filter(u => u.approved || u.rejected);
  const pendingJobs = jobs.filter(j => !j.approved && !j.rejected);
  const assignedJobs = jobs.filter(j => j.assignedTechnician);
  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const approvedJobs = jobs.filter(j => j.approved);

  function getStatus(item) {
    if (item.approved) return 'Approved';
    if (item.rejected) return 'Rejected';
    return 'Pending';
  }

  function getStatusColor(status) {
    if (status === 'Approved') return '#4CAF50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
  }

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />
      <main className="admin-main">
        <Topbar username="Admin" />

        <div className="cards-wrapper">
          <DashboardCard color="blue" count={pendingUsers.length} label="Pending User Approvals" icon={<UserCheck size={54} />} />
          <DashboardCard color="green" count={pendingJobs.length} label="Pending Job Approvals" icon={<FileClock size={54} />} />
          <DashboardCard color="orange" count={users.length} label="All Users" icon={<Users size={54} />} />
          <DashboardCard color="purple" count={assignedJobs.length} label="Assigned Jobs" icon={<Briefcase size={54} />} />
          <DashboardCard color="emerald" count={completedJobs.length} label="Completed Jobs" icon={<CheckCircle size={54} />} />
          <DashboardCard color="red" count={jobs.length} label="All Jobs" icon={<Briefcase size={54} />} />
          <DashboardCard color="teal" count={approvedJobs.length} label="Approved Jobs" icon={<CheckCircle size={54} />} />
        </div>

        <SectionTable
          title="All Users"
          columns={["Username", "Role", "Status", "Number"]}
          data={otherUsers}
          renderRow={(user) => (
            <>
              <td className="table-cell">{user.username}</td>
              <td className="table-cell">{user.role}</td>
              <td className="table-cell" style={{ color: getStatusColor(getStatus(user)), fontWeight: 600 }}>{getStatus(user)}</td>
              <td className="table-cell">{user.phone}</td>
            </>
          )}
          emptyMessage="No users found."
        />
      </main>
    </div>
  );
}

function DashboardCard({ color, count, label, icon }) {
  return (
    <div className={`card card-${color}`}> 
      <div>
        <div className="card-count">{count}</div>
        <div>{label}</div>
      </div>
      <div>{icon}</div>
    </div>
  );
}

function SectionTable({ title, columns, data, renderRow, emptyMessage }) {
  return (
    <div className="table-wrapper">
      <h2>{title}</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="table-head">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-message">{emptyMessage}</td></tr>
            ) : (
              data.map(item => <tr key={item._id}>{renderRow(item)}</tr>)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}