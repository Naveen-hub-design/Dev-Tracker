import React from 'react';
import Input from '../ui/Input';
import SectionHeader from '../ui/SectionHeader';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText } from 'lucide-react';

function ResumeEditor({ resume, updatePersonal }) {
  const p = resume?.personal || {};

  return (
    <div className="space-y-5">
      <SectionHeader title="Personal Information" subtitle="Your contact details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Full Name" value={p.name} onChange={(e) => updatePersonal('name', e.target.value)} icon={User} placeholder="John Doe" />
        <Input label="Email" value={p.email} onChange={(e) => updatePersonal('email', e.target.value)} icon={Mail} placeholder="john@example.com" type="email" />
        <Input label="Phone" value={p.phone} onChange={(e) => updatePersonal('phone', e.target.value)} icon={Phone} placeholder="+1 234 567 890" />
        <Input label="Location" value={p.location} onChange={(e) => updatePersonal('location', e.target.value)} icon={MapPin} placeholder="San Francisco, CA" />
        <Input label="LinkedIn" value={p.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} icon={Linkedin} placeholder="linkedin.com/in/johndoe" />
        <Input label="GitHub" value={p.github} onChange={(e) => updatePersonal('github', e.target.value)} icon={Github} placeholder="github.com/johndoe" />
        <Input label="Portfolio" value={p.portfolio} onChange={(e) => updatePersonal('portfolio', e.target.value)} icon={Globe} placeholder="johndoe.dev" className="sm:col-span-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Summary</label>
        <textarea
          value={p.summary || ''}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          placeholder="Brief professional summary..."
        />
      </div>
    </div>
  );
}

export default React.memo(ResumeEditor);
