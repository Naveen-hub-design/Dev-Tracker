import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';


const STATUS_CONFIG = {
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/10', dot: 'bg-emerald-500' },
  in_progress: { label: 'In Progress', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-600/10', dot: 'bg-amber-500' },
  planned: { label: 'Planned', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-600/10', dot: 'bg-blue-500' },
  archived: { label: 'Archived', bg: 'bg-slate-50', text: 'text-slate-500', ring: 'ring-slate-400/10', dot: 'bg-slate-400' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.planned;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ring-inset ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function TechChip({ name }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600">
      {name}
    </span>
  );
}

function ProjectCard({ project, onClick }) {
  const pct = project.completion || 0;
  const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
      onClick={() => onClick?.(project)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
        <span className="text-4xl font-bold text-slate-200 group-hover:text-slate-300 transition-colors select-none">
          {project.name?.charAt(0)}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.techStack?.slice(0, 4).map((t) => (
            <TechChip key={t} name={t} />
          ))}
          {project.techStack?.length > 4 && (
            <span className="text-[10px] text-slate-400 self-center ml-1">+{project.techStack.length - 4}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
          <span>Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}</span>
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-500">{pct}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Github className="w-3 h-3" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Live
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClick?.(project); }}
            className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(ProjectCard);
