

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../components/AssignedJobs.css'
import { useState } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  ClipboardCheck,
  PlusSquare,
  CheckCircle2,
  Ban,
  Briefcase,
  FilePlus2,
  ListChecks,
  Hammer,
  Trophy,
  Workflow,
  CheckCheck,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      { href: '/admin/rejectbytechnician', label: 'Technician Rejected', icon: ListChecks },
      { href: '/admin/achivment', label: 'Achievement', icon: Trophy },
    ],
    staff: [
      { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/staff/jobscreatebyme', label: 'Jobs Created By Me', icon: ListChecks },
      { href: '/staff/staffnewcreatejob', label: 'New Create Job', icon: FilePlus2 },
      { href: '/staff/staff-job-accept-reject', label: 'Approval Pending Jobs', icon: ClipboardCheck },
      { href: '/staff/staff-assign-jobs', label: 'My Assigned Jobs', icon: Briefcase },
      { href: '/staff/staff-aproval-job', label: 'Approved Jobs', icon: CheckCircle2 },
      { href: '/staff/staff-check-status', label: 'Jobs Status', icon: Hammer },
      { href: '/staff/staff-completed', label: 'Completed Jobs', icon: CheckCheck },
      { href: '/staff/staff-reject', label: 'Rejected Jobs', icon: ListChecks },
    ],
    technician: [
      { href: '/technician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/technician/jobs', label: 'My Assigned Jobs', icon: Hammer },
      { href: '/technician/TechnicianCompleted', label: 'Completed Jobs', icon: CheckCheck },
      { href: '/technician/TechnicianRejected', label: 'Rejected Jobs', icon: ListChecks },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <>
      {/* Toggle Button */}
      <div className="sidebar-toggle">
        <button onClick={toggleSidebar}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-title">
           <h1>SULTAN CRM</h1>
        </div>
        <nav className="sidebar-links">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${pathname === href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

         {/* fixed bottom logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
