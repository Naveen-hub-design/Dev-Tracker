import React from 'react';
import Input from '../ui/Input';
import SectionHeader from '../ui/SectionHeader';
import { User, Mail, MapPin, Linkedin, Github, Globe, FileText, Pen } from 'lucide-react';

function PortfolioEditor({ portfolio, updatePersonal }) {
  const p = portfolio?.personal || {};

  return (
    <div className="space-y-5">
      <SectionHeader title="Portfolio Settings" subtitle="Customize your portfolio content" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Full Name" value={p.name} onChange={(e) => updatePersonal('name', e.target.value)} icon={User} placeholder="John Doe" />
        <Input label="Title" value={p.title} onChange={(e) => updatePersonal('title', e.target.value)} icon={Pen} placeholder="Full Stack Developer" />
        <Input label="Email" value={p.email} onChange={(e) => updatePersonal('email', e.target.value)} icon={Mail} placeholder="john@example.com" type="email" />
        <Input label="Location" value={p.location} onChange={(e) => updatePersonal('location', e.target.value)} icon={MapPin} placeholder="San Francisco, CA" />
        <Input label="LinkedIn" value={p.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} icon={Linkedin} placeholder="linkedin.com/in/johndoe" />
        <Input label="GitHub" value={p.github} onChange={(e) => updatePersonal('github', e.target.value)} icon={Github} placeholder="johndoe" />
        <Input label="Portfolio URL" value={p.portfolio} onChange={(e) => updatePersonal('portfolio', e.target.value)} icon={Globe} placeholder="johndoe.dev" className="sm:col-span-2" />
        <Input label="Avatar URL" value={p.avatar} onChange={(e) => updatePersonal('avatar', e.target.value)} icon={Globe} placeholder="https://..." className="sm:col-span-2" hint="Auto-loaded from GitHub if empty" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
        <textarea
          value={p.bio || ''}
          onChange={(e) => updatePersonal('bio', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          placeholder="Short bio for your portfolio hero section..."
        />
      </div>
    </div>
  );
}

export default React.memo(PortfolioEditor);
