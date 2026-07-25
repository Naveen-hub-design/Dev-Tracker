import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

function GoalSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                <div className="h-3 bg-slate-50 rounded-full w-1/3 animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5"><div className="h-48 bg-slate-50 animate-pulse rounded-lg" /></Card>
        <Card className="p-5"><div className="h-48 bg-slate-50 animate-pulse rounded-lg" /></Card>
      </div>
    </div>
  );
}

export default React.memo(GoalSkeleton);
