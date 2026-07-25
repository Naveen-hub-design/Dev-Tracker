import React from 'react';
import Input from '../ui/Input';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import { Plus, Trash2, Briefcase } from 'lucide-react';

function ExperienceSection({ experience, updateExperience, addExperience, removeExperience }) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Experience"
        subtitle="Internships, training, freelance work"
        action={
          <Button onClick={addExperience} variant="ghost" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        }
      />
      {(experience || []).map((exp, i) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-3 relative">
          {experience.length > 1 && (
            <button
              onClick={() => removeExperience(i)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience {i + 1}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Company" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Google" />
            <Input label="Role" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} placeholder="Software Engineer Intern" />
            <Input label="Duration" value={exp.duration} onChange={(e) => updateExperience(i, 'duration', e.target.value)} placeholder="Jun 2025 - Aug 2025" className="sm:col-span-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => updateExperience(i, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder="What you did..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(ExperienceSection);
