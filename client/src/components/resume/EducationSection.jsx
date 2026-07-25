import React from 'react';
import Input from '../ui/Input';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

function EducationSection({ education, updateEducation, addEducation, removeEducation }) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Education"
        subtitle="Your academic background"
        action={
          <Button onClick={addEducation} variant="ghost" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        }
      />
      {(education || []).map((edu, i) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-3 relative">
          {education.length > 1 && (
            <button
              onClick={() => removeEducation(i)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Education {i + 1}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="College / University" value={edu.college} onChange={(e) => updateEducation(i, 'college', e.target.value)} placeholder="MIT" />
            <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech Computer Science" />
            <Input label="CGPA" value={edu.cgpa} onChange={(e) => updateEducation(i, 'cgpa', e.target.value)} placeholder="8.5" />
            <Input label="Graduation Year" value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} placeholder="2026" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(EducationSection);
