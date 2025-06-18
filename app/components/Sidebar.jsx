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
  Trophy,
  Workflow,
  CheckCheck,
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
      { href: '/admin/assigned-jobs-status', label: 'Jobs Status', icon: Workflow },
      { href: '/admin/completed', label: 'Completed Jobs', icon: CheckCheck },
      { href: '/admin/rejectbytechnician', label: 'Reject Jobs', icon: ListChecks },
      { href: '/admin/achivment', label: 'Achievement', icon: Trophy },
    ],
    staff: [
      { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/staff/jobscreatebyme', label: 'Jobs Created By Me', icon: ListChecks },
      { href: '/staff/staffnewcreatejob', label: 'New Create Job', icon: FilePlus2 },
      { href: '/staff/staff-job-accept-reject', label: 'Aproval Pending Jobs', icon: ClipboardCheck },
      { href: '/staff/staff-aproval-job', label: 'Aproval Jobs', icon: CheckCircle2 },
      { href: '/staff/staff-check-status', label: 'Jobs Status', icon: Hammer },
      { href: '/staff/staff-completed', label: 'Completed Jobs', icon: CheckCheck },
      { href: '/staff/staff-reject', label: 'Reject Jobs', icon: ListChecks },
    ],
    technician: [
      { href: '/technician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/technician/jobs', label: 'My Assigned Jobs', icon: Hammer },
      { href: '/technician/TechnicianCompleted', label: 'Completed Jobs', icon: CheckCheck },
      { href: '/technician/TechnicianRejected', label: 'Reject Jobs', icon: ListChecks },
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
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 10px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#9ca3af #1f2937',
      }}
    >
      <h2
        style={{
          margin: '0 0 20px',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        MyApp
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              transition: 'background-color 0.2s ease',
            }}
          >
            {Icon && <Icon size={18} />}
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;