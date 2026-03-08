import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineBookmark } from 'react-icons/hi';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: <HiOutlineBriefcase size={28} />, title: 'Browse Jobs', desc: 'Explore curated placement opportunities from top companies.' },
    { icon: <HiOutlineAcademicCap size={28} />, title: 'Smart Matching', desc: 'Get job recommendations based on your skills and profile.' },
    { icon: <HiOutlineChartBar size={28} />, title: 'Track Applications', desc: 'Monitor your application status in real time.' },
    { icon: <HiOutlineBookmark size={28} />, title: 'Save & Organize', desc: "Bookmark jobs and apply when you're ready." },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-200">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Woxsen University Placement Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Your career journey
              <br />
              <span className="text-blue-600">starts here.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              PlaceHub connects Woxsen University students with top placement opportunities. Build your profile, discover jobs, and land your dream role.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn-primary"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
          <p className="mt-3 text-slate-500">One platform to manage your entire placement journey.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get placed?</h2>
          <p className="mt-3 text-blue-100 max-w-md mx-auto">
            Join hundreds of Woxsen students already using PlaceHub to land their dream careers.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block mt-8 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
