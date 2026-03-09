import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import SavedJobs from './pages/SavedJobs';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageJobs from './pages/admin/ManageJobs';
import JobForm from './pages/admin/JobForm';
import ViewApplicants from './pages/admin/ViewApplicants';
import AllApplicants from './pages/admin/AllApplicants';
import AdminStudents from './pages/admin/AdminStudents';
import ChangePassword from './pages/admin/ChangePassword';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminVerifyOTP from './pages/admin/AdminVerifyOTP';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes with Navbar + Footer */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
      <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
      <Route path="/verify-otp" element={<><Navbar /><VerifyOTP /><Footer /></>} />
      <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /><Footer /></>} />
      <Route path="/verify-reset-otp" element={<><Navbar /><VerifyResetOTP /><Footer /></>} />
      <Route path="/reset-password" element={<><Navbar /><ResetPassword /><Footer /></>} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/verify-reset-otp" element={<AdminVerifyOTP />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />

      {/* Protected student routes with sidebar layout */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><DashboardLayout><Jobs /></DashboardLayout></ProtectedRoute>} />
      <Route path="/jobs/:id" element={<ProtectedRoute><DashboardLayout><JobDetails /></DashboardLayout></ProtectedRoute>} />
      <Route path="/saved-jobs" element={<ProtectedRoute><DashboardLayout><SavedJobs /></DashboardLayout></ProtectedRoute>} />
      <Route path="/my-applications" element={<ProtectedRoute><DashboardLayout><MyApplications /></DashboardLayout></ProtectedRoute>} />

      {/* Admin routes with sidebar layout */}
      <Route path="/admin" element={<AdminRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/jobs" element={<AdminRoute><DashboardLayout><ManageJobs /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/jobs/new" element={<AdminRoute><DashboardLayout><JobForm /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/jobs/:id/edit" element={<AdminRoute><DashboardLayout><JobForm /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/jobs/:id/applicants" element={<AdminRoute><DashboardLayout><ViewApplicants /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/students" element={<AdminRoute><DashboardLayout><AdminStudents /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/applicants" element={<AdminRoute><DashboardLayout><AllApplicants /></DashboardLayout></AdminRoute>} />
      <Route path="/admin/change-password" element={<AdminRoute><DashboardLayout><ChangePassword /></DashboardLayout></AdminRoute>} />
    </Routes>
  );
}

export default App;
