// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   LayoutDashboard,
//   UserCheck,
//   ClipboardCheck,
//   PlusSquare,
//   CheckCircle2,
//   Ban,
//   Briefcase,
//   FileClock,
// } from 'lucide-react';

// const Sidebar = ({ role }) => {
//   const pathname = usePathname();

//   const linksByRole = {
//     admin: [
//       { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { href: '/admin/pending-approvals', label: 'Pending User Approvals' },
//       { href: '/admin/pending-job-approvals', label: 'Pending job Approvals' },
//       { href: '/admin/newcreatejob', label: 'New Create Job' },
//       { href: '/admin/approved-jobs', label: 'Approved Jobs' },
//       { href: '/admin/rejected-jobs', label: 'Reject Jobs' },
//       { href: '/admin/alljob', label: 'All Jobs' },
//       { href: '/admin/assigned-jobs-status', label: 'Assigned Jobs' },
//     ],
//     staff: [
//       { href: '/staff/dashboard', label: 'Dashboard' },
//       { href: '/staff/jobscreatebyme', label: 'Jobs Created By Me' },
//       { href: '/staff/staffnewcreatejob', label: 'New Create Job' },
//     ],
//     technician: [
//       { href: '/technician/dashboard', label: 'Dashboard' },
//       { href: '/technician/jobs', label: 'My Assigned Jobs' },
//     ],
//   };

//   const links = linksByRole[role] || [];

//   return (
//     <aside
//       style={{
//         width: 240,
//         backgroundColor: '#1f2937',
//         color: 'white',
//         height: '100vh',
//         padding: '20px 10px',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '15px',
//       }}
//     >
//       <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 'bold' }}>MyApp</h2>
//       {links.map(({ href, label }) => (
//         <Link
//           key={href}
//           href={href}
//           style={{
//             padding: '10px 15px',
//             borderRadius: 6,
//             backgroundColor: pathname === href ? '#2563eb' : 'transparent',
//             textDecoration: 'none',
//             color: 'inherit',
//             fontWeight: pathname === href ? 'bold' : 'normal',
//             display: 'block',
//           }}
//         >
//           {Icon && <Icon size={18} />}
//           {label}
//         </Link>
//       ))}
//     </aside>
//   );
// };

// export default Sidebar;

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  ClipboardCheck,
  PlusSquare,
  CheckCircle2,
  Ban,
  Briefcase,
  FileClock,
  FilePlus2,
  ListChecks,
  Hammer,
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const pathname = usePathname();

  const linksByRole = {
    admin: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/pending-approvals', label: 'Pending User Approvals', icon: UserCheck },
      { href: '/admin/pending-job-approvals', label: 'Pending Job Approvals', icon: ClipboardCheck },
      { href: '/admin/newcreatejob', label: 'New Create Job', icon: PlusSquare },
      { href: '/admin/approved-jobs', label: 'Approved Jobs', icon: CheckCircle2 },
      { href: '/admin/rejected-jobs', label: 'Reject Jobs', icon: Ban },
      { href: '/admin/alljob', label: 'All Jobs', icon: Briefcase },
      { href: '/admin/assigned-jobs-status', label: 'Assigned Jobs', icon: FileClock },
    ],
    staff: [
      { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/staff/jobscreatebyme', label: 'Jobs Created By Me', icon: ListChecks },
      { href: '/staff/staffnewcreatejob', label: 'New Create Job', icon: FilePlus2 },
    ],
    technician: [
      { href: '/technician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/technician/jobs', label: 'My Assigned Jobs', icon: Hammer },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <aside
      style={{
        width: 240,
        backgroundColor: '#1f2937',
        color: 'white',
        height: '100vh',
        padding: '20px 10px',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 'bold' }}>MyApp</h2>

      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          style={{
            padding: '10px 15px',
            borderRadius: 6,
            backgroundColor: pathname === href ? '#2563eb' : 'transparent',
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: pathname === href ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {Icon && <Icon size={18} />}
          <span>{label}</span>
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;

