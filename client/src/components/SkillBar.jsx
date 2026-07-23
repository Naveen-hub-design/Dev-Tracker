export default function SkillBar({ skills = [], loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-24 mb-4" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-6 w-full mb-3" />
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="section-title">Skill Level</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700">{skill.name}</span>
              <span className="text-xs text-slate-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: skill.color || '#3B82F6',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
