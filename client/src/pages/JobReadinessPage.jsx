import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ClipboardCheck, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

// Readiness components
import useJobReadiness from '../hooks/useJobReadiness';
import {
  ScoreCard,
  ScoreBreakdown,
  RecommendationCard,
  SkillRadarChart,
  PlacementChecklist,
} from '../components/jobreadiness';
import WeakTopicsRecommender from '../components/leetcode/WeakTopicsRecommender';

// Role match components
import { useJobMatch } from '../hooks/useJobMatch';
import {
  JobMatchHero,
  RoleReadinessCards,
  SkillMatch,
  Suggestions,
  HiringScore,
  RecommendedJobs,
  JobMatchSkeleton,
} from '../components/jobmatch';

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}

export default function JobReadinessPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'roles' ? 'roles' : 'readiness';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'roles') setActiveTab('roles');
    else if (tabParam === 'readiness') setActiveTab('readiness');
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Readiness hook data
  const {
    loading: readinessLoading,
    overallScore,
    placementLevel,
    scoreCategories,
    radarData,
    recommendations,
    strengths,
    weaknesses,
    missingSkills,
    learningPath,
    checklist,
  } = useJobReadiness();

  // Role match hook data
  const {
    jobMatch,
    skillList,
    roleReadiness,
    suggestions,
    resumeScore,
    recommendedJobs,
    loading: matchLoading,
  } = useJobMatch();

  const loading = activeTab === 'readiness' ? readinessLoading : matchLoading;

  return (
    <PageContainer>
      {/* Top Header & Tab Switcher */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xs">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Placement Readiness & Job Match
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Comprehensive skill radar, target role matching, and interview readiness
              </p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => handleTabChange('readiness')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'readiness'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              Placement Readiness
            </button>
            <button
              onClick={() => handleTabChange('roles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roles'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Role Matching & Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Readiness View */}
      {activeTab === 'readiness' && (
        <>
          {readinessLoading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ScoreCard overallScore={overallScore} placementLevel={placementLevel} />
                <div className="lg:col-span-2">
                  <SkillRadarChart data={radarData} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreBreakdown categories={scoreCategories} />
                <RecommendationCard recommendations={recommendations} />
              </div>

              <PlacementChecklist
                checklist={checklist}
                learningPath={learningPath}
                strengths={strengths}
                weaknesses={weaknesses}
                missingSkills={missingSkills}
              />

              <div className="pt-2">
                <WeakTopicsRecommender />
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Tab 2: Role Matching View */}
      {activeTab === 'roles' && (
        <>
          {matchLoading ? (
            <JobMatchSkeleton />
          ) : !jobMatch ? (
            <EmptyState
              icon={AlertTriangle}
              title="No data available"
              description="Connect your GitHub, LeetCode, and competitive coding accounts in Settings to calculate your target role matches."
              action={
                <Link to="/settings">
                  <Button variant="primary" size="sm">
                    Go to Settings
                  </Button>
                </Link>
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <section aria-label="Job readiness score">
                <JobMatchHero jobMatch={jobMatch} loading={matchLoading} />
              </section>

              <section aria-label="Role readiness">
                <RoleReadinessCards roles={roleReadiness} />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section aria-label="Skill match">
                  <SkillMatch skills={skillList} />
                </section>
                <section aria-label="Suggestions">
                  <Suggestions suggestions={suggestions} />
                </section>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section aria-label="Hiring score">
                  <HiringScore resumeScore={resumeScore} />
                </section>
                <section aria-label="Recommended jobs">
                  <RecommendedJobs jobs={recommendedJobs} />
                </section>
              </div>
            </motion.div>
          )}
        </>
      )}
    </PageContainer>
  );
}
