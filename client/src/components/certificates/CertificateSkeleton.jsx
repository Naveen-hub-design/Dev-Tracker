import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

function CertificateSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
          <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
            <Award className="w-10 h-10 text-slate-200" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-full w-12 animate-pulse" />
            </div>
            <div className="h-3 bg-slate-50 rounded-full w-1/2 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-50 rounded-full w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-50 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default React.memo(CertificateSkeleton);
