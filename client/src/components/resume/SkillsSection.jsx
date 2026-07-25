import React, { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Code2, Layers, Database, Wrench, X, Plus } from 'lucide-react';

const CATEGORY_CONFIG = {
  languages: { label: 'Languages', Icon: Code2, color: 'blue' },
  frameworks: { label: 'Frameworks', Icon: Layers, color: 'emerald' },
  databases: { label: 'Databases', Icon: Database, color: 'amber' },
  tools: { label: 'Tools', Icon: Wrench, color: 'purple' },
};

const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-500/10',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-500/10',
  amber: 'bg-amber-50 text-amber-700 ring-amber-500/10',
  purple: 'bg-purple-50 text-purple-700 ring-purple-500/10',
};

function SkillTag({ skill, color, onRemove }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset ${COLOR_MAP[color]}`}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="hover:opacity-70 transition-opacity ml-0.5">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

function SkillCategory({ category, config, skills, onAdd, onRemove }) {
  const [input, setInput] = useState('');
  const { label, Icon, color } = config;

  const handleAdd = () => {
    const val = input.trim();
    if (val && !skills.includes(val)) {
      onAdd(category, [...skills, val]);
      setInput('');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 text-${color}-500`} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-[10px] text-slate-400 ml-auto">{skills.length} items</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.map((s) => (
          <SkillTag key={s} skill={s} color={color} onRemove={(sk) => onRemove(category, skills.filter((x) => x !== sk))} />
        ))}
        {skills.length === 0 && <p className="text-xs text-slate-400">No items — add below</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          placeholder={`Add ${label.toLowerCase()}...`}
        />
        <button
          onClick={handleAdd}
          className="h-8 px-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
}

function SkillsSection({ skills, updateSkills }) {
  const handleAdd = (category, newSkills) => updateSkills(category, newSkills);
  const handleRemove = (category, newSkills) => updateSkills(category, newSkills);

  return (
    <div className="space-y-4">
      <SectionHeader title="Skills" subtitle="Auto-imported from your projects — edit as needed" />
      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
        <SkillCategory
          key={key}
          category={key}
          config={config}
          skills={skills?.[key] || []}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

export default React.memo(SkillsSection);
