import React from 'react';
import ProjectCard from './ProjectCard';

function ProjectGrid({ projects, onSelect }) {
  if (!projects?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-400">No projects match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onClick={onSelect} />
      ))}
    </div>
  );
}

export default React.memo(ProjectGrid);
