import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeApi } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await resumeApi.getAll();
      setResumes(data.resumes || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your saved resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this resume'}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNew = () => {
    // Navigate to builder without an ID to start a fresh resume
    navigate('/builder?new=true');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background orbs */}
      <div className="orb w-80 h-80 bg-blue-600 top-10 -left-20 opacity-10" />
      <div className="orb w-80 h-80 bg-purple-600 bottom-20 right-0 opacity-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
                User Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name || 'Candidate'}</span>!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage all your cloud-synced resumes and create job-targeted versions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="dashboard-create-btn"
              onClick={handleCreateNew}
              className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2 shadow-glow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create New Resume</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Saved Resumes</p>
              <p className="text-2xl font-bold text-white mt-0.5">{resumes.length}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Storage Backend</p>
              <p className="text-2xl font-bold text-white mt-0.5">MongoDB Atlas</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Cloud Sync Status</p>
              <p className="text-2xl font-bold text-white mt-0.5">Active ✓</p>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchResumes}
              className="text-xs font-semibold underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-xs">Loading resumes from MongoDB...</p>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div className="glass-card rounded-3xl p-10 text-center max-w-xl mx-auto space-y-5 border border-white/10 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto text-primary-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">No resumes created yet</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                Get started by creating your first resume. It will be securely stored in your personal MongoDB account.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2 shadow-glow"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Build Your First Resume</span>
            </button>
          </div>
        ) : (
          /* Resumes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {resumes.map((resume) => {
              const eduCount = (resume.education || []).length;
              const expCount = (resume.experience || []).length;
              const skillsCount = (resume.skills || []).length;
              const projCount = (resume.projects || []).length;
              const dateFormatted = new Date(resume.updatedAt || resume.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={resume._id}
                  className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary-500/40 transition-all duration-300 flex flex-col justify-between group shadow-card"
                >
                  <div>
                    {/* Top row: template badge & date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        resume.template === 'modern'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {resume.template === 'modern' ? 'Template: Modern' : 'Template: ATS Friendly'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {dateFormatted}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                      {resume.title || 'Untitled Resume'}
                    </h3>

                    {/* Candidate Name / Subtitle */}
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {resume.personal?.fullName ? `Candidate: ${resume.personal.fullName}` : 'No candidate name set'}
                    </p>

                    {/* Content breakdown tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {eduCount} Education
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {expCount} Experience
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {skillsCount} Skills
                      </span>
                      {projCount > 0 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {projCount} Projects
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/builder?id=${resume._id}`)}
                      className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 flex-1 justify-center"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit in Builder
                    </button>

                    <button
                      onClick={() => handleDelete(resume._id, resume.title)}
                      disabled={deletingId === resume._id}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      {deletingId === resume._id ? (
                        <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
