import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import { Target } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import {
  GoalsHero, StreakCard, ProgressRings, Heatmap, CalendarView,
  AchievementBadges, ReminderCards, WeeklySummary, MonthlySummary,
  GoalCharts, GoalEditor, GoalSkeleton,
} from '../components/goals';

export default function GoalsPage() {
  const {
    goals, todayActivity, streaks, achievements, weeklyData, monthlyData,
    heatmapData, calendarData, ringProgress, showEditor, setShowEditor,
    updateGoal, REMINDERS,
  } = useGoals();
  const [loading] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">Coding Goals</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set targets, track streaks, and level up your coding habits.</p>
          </div>
          <Button variant="primary" size="sm" icon={Target} onClick={() => setShowEditor(true)}>
            Edit Goals
          </Button>
        </div>

        {loading ? <GoalSkeleton /> : (
          <>
            <GoalsHero streaks={streaks} todayActivity={todayActivity} ringProgress={ringProgress} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              <StreakCard streaks={streaks} />
              <ProgressRings ringProgress={ringProgress} />
              <ReminderCards reminders={REMINDERS} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
              <WeeklySummary weeklyData={weeklyData} goals={goals} />
              <MonthlySummary monthlyData={monthlyData} goals={goals} />
            </div>

            <Heatmap data={heatmapData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
              <CalendarView calendarData={calendarData} />
              <GoalCharts weeklyData={weeklyData} monthlyData={monthlyData} />
            </div>

            <AchievementBadges achievements={achievements} />
          </>
        )}
      </div>

      <AnimatePresence>
        {showEditor && <GoalEditor goals={goals} onUpdate={updateGoal} onClose={() => setShowEditor(false)} />}
      </AnimatePresence>
    </PageContainer>
  );
}
