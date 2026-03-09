import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineUser, HiOutlineMail, HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/api/admin/students');
      setStudents(data.students);
    } catch (error) {
      console.error('Fetch students error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.branch && s.branch.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Students <span className="text-base font-normal text-slate-500">({students.length})</span>
        </h1>
        <input
          type="text"
          placeholder="Search by name, email or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <HiOutlineUser className="mx-auto text-slate-300" size={48} />
          <p className="mt-4 text-slate-500">No students found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{student.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{student.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineAcademicCap size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{student.branch}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-400 font-medium flex-shrink-0">CGPA</span>
                  <span>{student.cgpa}</span>
                </div>
              </div>

              {/* Skills */}
              {student.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Applied Jobs */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                  <HiOutlineBriefcase size={14} />
                  Applied Jobs ({student.applications.length})
                </p>
                {student.applications.length > 0 ? (
                  <ul className="space-y-1">
                    {student.applications.map((app, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 flex items-start gap-1.5"
                      >
                        <span className="text-slate-400 mt-1">•</span>
                        <span>
                          {app.jobTitle} <span className="text-slate-400">—</span> {app.company}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No applications yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
