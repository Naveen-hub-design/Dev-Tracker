import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Bell, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

function ReminderCards({ reminders }) {
  const [idx, setIdx] = useState(0);
  const r = reminders[idx];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900">Daily Reminder</h3>
        </div>
        <motion.div
          key={idx}
          className={`p-4 rounded-xl bg-gradient-to-br ${r.color} text-white`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
            <div>
              <p className="font-bold text-sm">{r.title}</p>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">{r.desc}</p>
            </div>
          </div>
        </motion.div>
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setIdx((i) => (i - 1 + reminders.length) % reminders.length)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div className="flex gap-1">
            {reminders.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-blue-500 w-4' : 'bg-slate-200'}`} />
            ))}
          </div>
          <button onClick={() => setIdx((i) => (i + 1) % reminders.length)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(ReminderCards);
