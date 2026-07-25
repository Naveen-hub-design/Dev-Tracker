import React from 'react';
import ResumeTemplate from './ResumeTemplate';

function ResumePreview({ resume, template }) {
  return (
    <div className="sticky top-4">
      <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Live Preview</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{template}</span>
        </div>
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <ResumeTemplate resume={resume} template={template} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(ResumePreview);
