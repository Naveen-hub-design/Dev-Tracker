import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

const TEMPLATES = {
  modern: {
    name: 'Modern',
    headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    headerText: 'text-white',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-50',
    sectionBorder: 'border-blue-200',
    tagBg: 'bg-blue-50 text-blue-700',
  },
  professional: {
    name: 'Professional',
    headerBg: 'bg-slate-900',
    headerText: 'text-white',
    accent: 'text-slate-700',
    accentBg: 'bg-slate-50',
    sectionBorder: 'border-slate-200',
    tagBg: 'bg-slate-100 text-slate-700',
  },
  minimal: {
    name: 'Minimal',
    headerBg: 'bg-white border-b-2 border-slate-900',
    headerText: 'text-slate-900',
    accent: 'text-slate-600',
    accentBg: 'bg-transparent',
    sectionBorder: 'border-slate-200',
    tagBg: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
  },
  dark: {
    name: 'Dark',
    headerBg: 'bg-gradient-to-r from-gray-900 to-gray-800',
    headerText: 'text-white',
    accent: 'text-emerald-400',
    accentBg: 'bg-gray-800',
    sectionBorder: 'border-gray-700',
    tagBg: 'bg-gray-800 text-emerald-300 ring-1 ring-gray-700',
  },
};

function ResumeTemplate({ resume, template }) {
  const t = TEMPLATES[template] || TEMPLATES.modern;
  const p = resume?.personal || {};
  const isDark = template === 'dark';

  return (
    <div className={`w-full min-h-[800px] text-[11px] leading-relaxed ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-slate-800'} shadow-lg`}>
      {/* Header */}
      <div className={`${t.headerBg} ${t.headerText} p-6`}>
        <h1 className="text-xl font-bold">{p.name || 'Your Name'}</h1>
        {p.summary && <p className={`text-[11px] mt-1 ${isDark ? 'text-gray-300' : 'text-white/80'}`}>{p.summary}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-[10px]">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{p.github}</span>}
          {p.portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{p.portfolio}</span>}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Education */}
        {resume.education?.some((e) => e.college) && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Education
            </h2>
            {resume.education.filter((e) => e.college).map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-[11px]">{edu.degree || 'Degree'}</p>
                  {edu.cgpa && <span className="text-[10px] font-medium">CGPA: {edu.cgpa}</span>}
                </div>
                <p className={`${t.accent} text-[10px]`}>{edu.college}{edu.year ? ` — ${edu.year}` : ''}</p>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resume.skills && Object.values(resume.skills).some((s) => s?.length > 0) && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Skills
            </h2>
            <div className="space-y-1.5">
              {resume.skills.languages?.length > 0 && (
                <p className="text-[10px]"><span className="font-semibold">Languages:</span> {resume.skills.languages.join(', ')}</p>
              )}
              {resume.skills.frameworks?.length > 0 && (
                <p className="text-[10px]"><span className="font-semibold">Frameworks:</span> {resume.skills.frameworks.join(', ')}</p>
              )}
              {resume.skills.databases?.length > 0 && (
                <p className="text-[10px]"><span className="font-semibold">Databases:</span> {resume.skills.databases.join(', ')}</p>
              )}
              {resume.skills.tools?.length > 0 && (
                <p className="text-[10px]"><span className="font-semibold">Tools:</span> {resume.skills.tools.join(', ')}</p>
              )}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Projects
            </h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[11px]">{proj.name}</p>
                  {proj.githubUrl && <a href={proj.githubUrl} className={`${t.accent}`}><Github className="w-3 h-3" /></a>}
                  {proj.liveUrl && <a href={proj.liveUrl} className={`${t.accent}`}><ExternalLink className="w-3 h-3" /></a>}
                </div>
                <p className="text-[10px] mt-0.5">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t2) => (
                      <span key={t2} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${t.tagBg}`}>{t2}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {resume.experience?.some((e) => e.company) && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Experience
            </h2>
            {resume.experience.filter((e) => e.company).map((exp, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-[11px]">{exp.role || 'Role'}</p>
                  <span className="text-[10px] text-slate-400">{exp.duration}</span>
                </div>
                <p className={`${t.accent} text-[10px]`}>{exp.company}</p>
                {exp.description && <p className="text-[10px] mt-0.5">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {resume.achievements?.length > 0 && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Achievements
            </h2>
            <ul className="list-disc list-inside space-y-0.5">
              {resume.achievements.map((a, i) => (
                <li key={i} className="text-[10px]">{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Coding Profiles */}
        {resume.codingProfiles && (
          <section>
            <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b ${t.sectionBorder} ${t.accent}`}>
              Coding Profiles
            </h2>
            <div className="grid grid-cols-3 gap-3 text-[10px]">
              {resume.codingProfiles.github?.username && (
                <div>
                  <p className="font-semibold">GitHub</p>
                  <p className={t.accent}>@{resume.codingProfiles.github.username}</p>
                  <p>{resume.codingProfiles.github.repos} repos · {resume.codingProfiles.github.stars} stars</p>
                </div>
              )}
              {resume.codingProfiles.leetcode?.username && (
                <div>
                  <p className="font-semibold">LeetCode</p>
                  <p className={t.accent}>@{resume.codingProfiles.leetcode.username}</p>
                  <p>{resume.codingProfiles.leetcode.solved} solved</p>
                </div>
              )}
              {resume.codingProfiles.hackerrank?.username && (
                <div>
                  <p className="font-semibold">HackerRank</p>
                  <p className={t.accent}>@{resume.codingProfiles.hackerrank.username}</p>
                  <p>{resume.codingProfiles.hackerrank.solved} solved</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default React.memo(ResumeTemplate);
