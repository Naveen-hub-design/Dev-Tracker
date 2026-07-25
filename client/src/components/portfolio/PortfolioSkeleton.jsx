import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/LoadingSkeleton';

function PortfolioSkeleton() {
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0.6 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    </motion.div>
  );
}

export default React.memo(PortfolioSkeleton);
