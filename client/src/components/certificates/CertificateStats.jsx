import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Award, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

const stats = [
  { label: 'Total', key: 'total', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active', key: 'active', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Expiring Soon', key: 'expiringSoon', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Categories', key: 'categories', icon: Layers, color: 'text-violet-600', bg: 'bg-violet-50' },
];

function CertificateStats({ data }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div key={s.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data[s.key] || 0}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default React.memo(CertificateStats);
