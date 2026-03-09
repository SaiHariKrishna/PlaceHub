import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiMenu } from 'react-icons/hi';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Browse Jobs',
  '/my-applications': 'My Applications',
  '/saved-jobs': 'Saved Jobs',
  '/profile': 'Profile',
  '/admin': 'Admin Dashboard',
  '/admin/jobs': 'Manage Jobs',
  '/admin/jobs/new': 'Create Job',
  '/admin/students': 'Students',
  '/admin/applicants': 'All Applicants',
  '/admin/change-password': 'Settings',
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    if (location.pathname.match(/^\/admin\/jobs\/[^/]+\/edit$/)) return 'Edit Job';
    if (location.pathname.match(/^\/admin\/jobs\/[^/]+\/applicants$/)) return 'View Applicants';
    if (location.pathname.match(/^\/jobs\/[^/]+$/)) return 'Job Details';
    return 'PlaceHub';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 mr-3 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <HiMenu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
