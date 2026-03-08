import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/verify-otp', { email, otp });
      toast.success('Email verified! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // No email in state — user navigated here directly
  if (!email) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500">No email found. Please register first.</p>
          <Link to="/register" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="text-slate-500 mt-2">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full input text-center text-2xl tracking-[0.5em] font-mono py-3"
              placeholder="000000"
            />
            <p className="text-xs text-slate-400 mt-2 text-center">Code expires in 5 minutes</p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full mt-6 btn-primary text-sm"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
