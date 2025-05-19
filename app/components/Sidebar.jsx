'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ role }) => {
  const pathname = usePathname();

  const linksByRole = {
    admin: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/pending-approvals', label: 'Pending User Approvals' },
      { href: '/admin/pending-job-approvals', label: 'Pending job Approvals' },
      { href: '/admin/newcreatejob', label: 'New Create Job' },
      { href: '/admin/approved-jobs', label: 'Approved Jobs' },
      { href: '/admin/rejected-jobs', label: 'Reject Jobs' },
      { href: '/admin/alljob', label: 'All Jobs' },
      // Add admin links here
    ],
    staff: [
      { href: '/staff/dashboard', label: 'Dashboard' },
      { href: '/staff/jobscreatebyme', label: 'Jobs Created By Me' },
      { href: '/staff/staffnewcreatejob', label: 'New Create Job' },
    ],
    technician: [
      { href: '/technician/dashboard', label: 'Dashboard' },
      { href: '/technician/jobs', label: 'My Assigned Jobs' },

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
      {links.map(({ href, label }) => (
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
            display: 'block',
          }}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
