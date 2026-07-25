import { useState } from 'react';
import { useResume } from '../hooks/useResume';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import {
  ResumeEditor,
  ResumePreview,
  EducationSection,
  SkillsSection,
  ProjectSection,
  AchievementSection,
  ExperienceSection,
} from '../components/resume';
import { Download, Printer, FileText } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', label: 'Modern', color: 'bg-blue-600' },
  { id: 'professional', label: 'Professional', color: 'bg-slate-900' },
  { id: 'minimal', label: 'Minimal', color: 'bg-white ring-2 ring-slate-300' },
  { id: 'dark', label: 'Dark', color: 'bg-gray-800' },
];

function ResumeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    </div>
  );
}

export default function ResumePage() {
  const {
    resume, activeTemplate, loading,
    updatePersonal, updateEducation, addEducation, removeEducation,
    updateSkills, updateExperience, addExperience, removeExperience,
    setTemplate, handlePrint,
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal');

  if (loading) {
    return (
      <PageContainer title="Resume Builder">
        <ResumeSkeleton />
      </PageContainer>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'achievements', label: 'Achievements' },
  ];

  return (
    <PageContainer
      title="Resume Builder"
      subtitle="Build an ATS-friendly resume with live preview"
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="secondary" size="sm">
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>
        </div>
      }
    >
      {/* Template Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Template</span>
          <div className="flex gap-2 ml-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTemplate === t.id
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${t.color}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-1 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-slate-700'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            {activeTab === 'personal' && (
              <ResumeEditor resume={resume} updatePersonal={updatePersonal} />
            )}
            {activeTab === 'education' && (
              <EducationSection
                education={resume.education}
                updateEducation={updateEducation}
                addEducation={addEducation}
                removeEducation={removeEducation}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsSection skills={resume.skills} updateSkills={updateSkills} />
            )}
            {activeTab === 'projects' && (
              <ProjectSection projects={resume.projects} />
            )}
            {activeTab === 'experience' && (
              <ExperienceSection
                experience={resume.experience}
                updateExperience={updateExperience}
                addExperience={addExperience}
                removeExperience={removeExperience}
              />
            )}
            {activeTab === 'achievements' && (
              <AchievementSection
                achievements={resume.achievements}
                codingProfiles={resume.codingProfiles}
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <ResumePreview resume={resume} template={activeTemplate} />
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="lg:hidden">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Live Preview</span>
          </div>
          <div className="p-2 max-h-[500px] overflow-y-auto">
            <ResumePreview resume={resume} template={activeTemplate} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
