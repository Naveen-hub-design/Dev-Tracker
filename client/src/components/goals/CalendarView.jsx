import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LEVEL_COLORS = {
  0: 'bg-slate-50 text-slate-300',
  1: 'bg-emerald-50 text-emerald-700',
  2: 'bg-emerald-100 text-emerald-800',
  3: 'bg-emerald-200 text-emerald-800',
  4: 'bg-emerald-500 text-white',
};

function CalendarView({ calendarData }) {
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
          ))}
          {calendarData.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;
            const level = !cell.data ? 0 :
              (cell.data.commits + cell.data.problems) <= 1 ? 1 :
              (cell.data.commits + cell.data.problems) <= 3 ? 2 :
              (cell.data.commits + cell.data.problems) <= 5 ? 3 : 4;
            return (
              <motion.div
                key={cell.key}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all hover:scale-110 ${LEVEL_COLORS[level]} ${cell.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.008 }}
              >
                <span className="text-[10px] leading-none">{cell.day}</span>
                {cell.data && (
                  <span className="text-[7px] leading-none mt-0.5">{cell.data.commits + cell.data.problems}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(CalendarView);
