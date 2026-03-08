import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import downloadResume from '../utils/downloadResume';
import { HiOutlineUpload, HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';

export default function Profile() {
  const { checkAuth } = useAuth();
  const [form, setForm] = useState({
    name: '', age: '', branch: '', skills: [], cgpa: '',
    linkedin: '', github: '', portfolio: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/users/profile');
      setForm({
        name: data.name || '',
        age: data.age || '',
        branch: data.branch || '',
        skills: data.skills || [],
        cgpa: data.cgpa || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
      });
      setResumeUrl(data.resumeUrl || '');
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/users/profile', {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
      });
      await checkAuth();
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error('Only PDF files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be under 5MB');
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const { data } = await api.post('/api/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeUrl(data.resumeUrl);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} min="16" max="100"
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <input type="text" name="branch" value={form.branch} onChange={handleChange} placeholder="e.g., Computer Science"
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CGPA</label>
              <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange} step="0.01" min="0" max="10"
                className="w-full input text-sm" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Skills</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
              className="flex-1 input text-sm"
            />
            <button type="button" onClick={addSkill} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium border border-slate-200 transition-colors">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">
                  <HiOutlineX size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn</label>
              <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..."
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub</label>
              <input type="url" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..."
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Portfolio</label>
              <input type="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com"
                className="w-full input text-sm" />
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Resume</h2>
          {resumeUrl && (
            <button
              type="button"
              onClick={() => downloadResume(resumeUrl, `${form.name || 'resume'}.pdf`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-600 font-medium hover:bg-slate-100 mb-4"
            >
              <HiOutlineDocumentText size={18} /> Download Resume
            </button>
          )}
          <label
            className={`flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              uploading ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <HiOutlineUpload size={20} className="text-slate-400" />
            <span className="text-sm text-slate-500">
              {uploading ? 'Uploading...' : 'Click to upload PDF (max 5MB)'}
            </span>
            <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
