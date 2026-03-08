import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineClipboardCheck,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
} from 'react-icons/hi';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/jobs', label: 'Jobs', icon: HiOutlineBriefcase },
  { to: '/my-applications', label: 'Applications', icon: HiOutlineClipboardCheck },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: HiOutlineBookmark },
  { to: '/profile', label: 'Profile', icon: HiOutlineUser },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineChartBar },
  { to: '/admin/jobs', label: 'Manage Jobs', icon: HiOutlineBriefcase },
  { to: '/admin/applicants', label: 'Applicants', icon: HiOutlineUsers },
  { to: '/admin/change-password', label: 'Settings', icon: HiOutlineCog },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin' || path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PH</span>
          </div>
          <span className="font-bold text-xl text-slate-900">PlaceHub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User section + Logout */}
        <div className="border-t border-slate-200 p-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
