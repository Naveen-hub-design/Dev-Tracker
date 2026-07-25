import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/LoadingSkeleton';

const shimmer = {
  hidden: { opacity: 0.6 },
  animate: { opacity: [0.6, 1, 0.6], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
};

function LCPageSkeleton() {
  return (
    <motion.div variants={shimmer} initial="hidden" animate="animate" className="space-y-6">
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </motion.div>
  );
}

export default React.memo(LCPageSkeleton);
