import { motion } from 'framer-motion';
import { Briefcase, RefreshCw } from 'lucide-react';
import useJobReadiness from '../hooks/useJobReadiness';
import { ScoreCard, ScoreBreakdown, RecommendationCard, SkillRadarChart, PlacementChecklist } from '../components/jobreadiness';

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
  const {
    loading,
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Job Readiness</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your placement preparation analysis</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Score + Radar Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ScoreCard overallScore={overallScore} placementLevel={placementLevel} />
            <div className="lg:col-span-2">
              <SkillRadarChart data={radarData} />
            </div>
          </div>

          {/* Score Breakdown + Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreBreakdown categories={scoreCategories} />
            <RecommendationCard recommendations={recommendations} />
          </div>

          {/* Checklist, Learning Path, Strengths/Weaknesses */}
          <PlacementChecklist
            checklist={checklist}
            learningPath={learningPath}
            strengths={strengths}
            weaknesses={weaknesses}
            missingSkills={missingSkills}
          />
        </motion.div>
      )}
    </div>
  );
}
