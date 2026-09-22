import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { FolderKanban, ExternalLink, Github } from 'lucide-react';

function ProjectSection({ projects }) {
  if (!projects?.length) return null;

  return (
    <div className="space-y-4">
      <SectionHeader title="Projects" subtitle="Imported from your DevTrack portfolio" />
      <div className="space-y-3">
        {projects.map((project, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{project.name}</h4>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies?.slice(0, 6).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ProjectSection);
