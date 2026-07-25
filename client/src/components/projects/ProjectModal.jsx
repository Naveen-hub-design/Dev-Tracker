import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Calendar, Users, CheckCircle, Lightbulb, Rocket, Tag } from 'lucide-react';

const STATUS_COLORS = {
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  planned: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  archived: 'bg-slate-50 text-slate-500 ring-slate-400/10',
};

function ProjectModal({ project, onClose }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [handleEscape]);

  if (!project) return null;
  const statusCls = STATUS_COLORS[project.status] || STATUS_COLORS.planned;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        <motion.div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/80 backdrop-blur hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>

          <div className="h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
            <span className="text-6xl font-bold text-white/10">{project.name?.charAt(0)}</span>
            <div className="absolute bottom-4 left-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusCls}`}>
                {project.status?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Started {project.startDate}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated {project.updatedAt}</span>
              {project.contributors && (
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.contributors.join(', ')}</span>
              )}
            </div>

            {project.techStack?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Completion</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completion || 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{project.completion || 0}%</span>
              </div>
            </div>

            {project.features?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Features
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {project.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.challenges?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Challenges
                </h4>
                <ul className="space-y-1.5">
                  {project.challenges.map((c) => (
                    <li key={c} className="text-sm text-slate-500 pl-4 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.futureImprovements?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" /> Future Improvements
                </h4>
                <ul className="space-y-1.5">
                  {project.futureImprovements.map((fi) => (
                    <li key={fi} className="text-sm text-slate-500 pl-4 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {fi}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.milestones?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Timeline</h4>
                <div className="space-y-0">
                  {project.milestones.map((m, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${i === project.milestones.length - 1 ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'}`} />
                        {i < project.milestones.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-slate-700">{m.label}</p>
                        <p className="text-[11px] text-slate-400">{m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Github className="w-4 h-4" /> Repository
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default React.memo(ProjectModal);
