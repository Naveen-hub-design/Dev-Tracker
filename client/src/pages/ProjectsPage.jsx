import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import PageContainer from '../components/ui/PageContainer';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import {
  ProjectsHero,
  ProjectsHeroCards,
  ProjectFilters,
  ProjectGrid,
  ProjectModal,
  ProjectTimeline,
  ProjectAnalytics,
  TechStackChart,
} from '../components/projects';

function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const {
    projects, allProjects, loading, error, stats, allTech,
    search, setSearch, statusFilter, setStatusFilter,
    techFilter, setTechFilter, sortBy, setSortBy, refetch,
  } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);

  if (loading) {
    return (
      <PageContainer title="Projects">
        <ProjectsSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Projects">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <button onClick={refetch} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">Retry</button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="" subtitle="">
      <section aria-label="Hero">
        <ProjectsHero stats={stats} />
      </section>

      <section aria-label="Stats">
        <ProjectsHeroCards stats={stats} />
      </section>

      <section aria-label="Filters">
        <ProjectFilters
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          techFilter={techFilter} setTechFilter={setTechFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          allTech={allTech}
        />
      </section>

      <section aria-label="Projects">
        <ProjectGrid projects={projects} onSelect={setSelectedProject} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section aria-label="Technology usage">
          <TechStackChart projects={allProjects} />
        </section>
        <section aria-label="Framework analytics">
          <ProjectAnalytics projects={allProjects} />
        </section>
      </div>

      <section aria-label="Timeline">
        <ProjectTimeline projects={allProjects} />
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </PageContainer>
  );
}
