import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-slate-100 rounded-full w-12 animate-pulse" />
                <div className="h-3 bg-slate-50 rounded-full w-16 animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5"><div className="h-64 bg-slate-50 animate-pulse rounded-lg" /></Card>
        <Card className="p-5"><div className="h-64 bg-slate-50 animate-pulse rounded-lg" /></Card>
      </div>
      <Card className="p-5"><div className="h-80 bg-slate-50 animate-pulse rounded-lg" /></Card>
    </div>
  );
}

export default React.memo(AdminSkeleton);
