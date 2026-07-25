import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Target } from 'lucide-react';

function GoalEditor({ goals, onUpdate, onClose }) {
  const [form, setForm] = useState({
    daily: { ...goals.daily },
    weekly: { ...goals.weekly },
    monthly: { ...goals.monthly },
  });

  const update = (period, field, value) => {
    setForm((prev) => ({ ...prev, [period]: { ...prev[period], [field]: Math.max(0, parseInt(value) || 0) } }));
  };

  const save = () => {
    Object.entries(form).forEach(([period, fields]) => {
      Object.entries(fields).forEach(([field, value]) => {
        onUpdate(period, field, value);
      });
    });
    onClose();
  };

  const periods = [
    { key: 'daily', label: 'Daily Goals', color: 'blue' },
    { key: 'weekly', label: 'Weekly Goals', color: 'emerald' },
    { key: 'monthly', label: 'Monthly Goals', color: 'violet' },
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh] overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200"
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900">Edit Goals</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {periods.map((p) => (
            <div key={p.key}>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{p.label}</h4>
              <div className="grid grid-cols-3 gap-2">
                {['commits', 'problems', 'hours'].map((f) => (
                  <Input key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} type="number"
                    value={form[p.key][f]} onChange={(e) => update(p.key, f, e.target.value)} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={save} variant="primary" size="sm">Save Goals</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(GoalEditor);
