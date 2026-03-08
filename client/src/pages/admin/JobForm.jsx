import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    skills: [],
    deadline: '',
    requirements: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [existingLogo, setExistingLogo] = useState('');
  const [removeLogo, setRemoveLogo] = useState(false);

  useEffect(() => {
    if (isEdit) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/api/jobs/${id}`);
      setForm({
        title: data.title,
        company: data.company,
        description: data.description,
        location: data.location,
        jobType: data.jobType,
        salary: data.salary || '',
        skills: data.skills || [],
        deadline: data.deadline ? data.deadline.split('T')[0] : '',
        requirements: data.requirements || [],
      });
      if (data.logo) setExistingLogo(data.logo);
    } catch {
      toast.error('Failed to load job');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setRemoveLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setExistingLogo('');
    setRemoveLogo(true);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
    }
  };

  const addReq = () => {
    const req = reqInput.trim();
    if (req) {
      setForm({ ...form, requirements: [...form.requirements, req] });
      setReqInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('company', form.company);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('jobType', form.jobType);
      formData.append('salary', form.salary);
      formData.append('deadline', form.deadline);
      formData.append('skills', JSON.stringify(form.skills));
      formData.append('requirements', JSON.stringify(form.requirements));

      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (removeLogo) {
        formData.append('removeLogo', 'true');
      }

      if (isEdit) {
        await api.put(`/api/jobs/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Job updated!');
      } else {
        await api.post('/api/jobs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Job created!');
      }
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">
        {isEdit ? 'Edit Job' : 'Add New Job'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} required
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} required
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type *</label>
              <select name="jobType" value={form.jobType} onChange={handleChange}
                className="w-full input text-sm">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary</label>
              <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., 5-8 LPA"
                className="w-full input text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline *</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required
                className="w-full input text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                className="w-full input text-sm resize-none" />
            </div>

            {/* Company Logo Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Logo (optional)</label>
              <div className="flex items-center gap-4">
                {(logoPreview || (existingLogo && !removeLogo)) && (
                  <div className="relative">
                    <img
                      src={logoPreview || existingLogo}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-white p-1"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove Logo"
                    >
                      <HiOutlineX size={12} />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors w-fit">
                    <HiOutlinePhotograph size={18} />
                    {logoPreview || (existingLogo && !removeLogo) ? 'Replace Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, or WEBP. Max 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Required Skills *</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add skill"
              className="flex-1 input text-sm"
            />
            <button type="button" onClick={addSkill} className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                {s}
                <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })} className="hover:text-red-600">
                  <HiOutlineX size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addReq(); } }}
              placeholder="Add requirement"
              className="flex-1 input text-sm"
            />
            <button type="button" onClick={addReq} className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {form.requirements.map((r, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                {r}
                <button type="button" onClick={() => setForm({ ...form, requirements: form.requirements.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-600">
                  <HiOutlineX size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}
