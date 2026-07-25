import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Hash, Clock, Trash2 } from 'lucide-react';

const ORG_COLORS = {
  AWS: 'from-orange-500 to-amber-500',
  Google: 'from-blue-500 to-cyan-500',
  Microsoft: 'from-sky-500 to-blue-600',
  Coursera: 'from-indigo-500 to-violet-500',
  Udemy: 'from-purple-500 to-pink-500',
  NPTEL: 'from-green-500 to-emerald-500',
  Other: 'from-slate-500 to-slate-600',
};

const ORG_BG = {
  AWS: 'bg-orange-50 text-orange-700',
  Google: 'bg-blue-50 text-blue-700',
  Microsoft: 'bg-sky-50 text-sky-700',
  Coursera: 'bg-indigo-50 text-indigo-700',
  Udemy: 'bg-purple-50 text-purple-700',
  NPTEL: 'bg-green-50 text-green-700',
  Other: 'bg-slate-50 text-slate-700',
};

function CertificateCard({ cert, onClick, onDelete }) {
  const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
  const isExpiringSoon = cert.expiryDate && !isExpired && (new Date(cert.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) < 90;
  const grad = ORG_COLORS[cert.category] || ORG_COLORS.Other;

  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 group cursor-pointer"
      onClick={() => onClick?.(cert)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      layout
    >
      <div className={`h-28 bg-gradient-to-br ${grad} flex items-center justify-center relative overflow-hidden`}>
        {cert.image ? (
          <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" />
        ) : (
          <Award className="w-12 h-12 text-white/30" />
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {isExpired && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">Expired</span>}
          {isExpiringSoon && <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">Expiring Soon</span>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(cert.id); }}
          className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 truncate">{cert.name}</h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ring-inset ${ORG_BG[cert.category] || ORG_BG.Other}`}>
            {cert.category}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">{cert.organization}</p>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          {cert.issueDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
          {cert.expiryDate && (
            <span className={`flex items-center gap-1.5 ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : ''}`}>
              <Clock className="w-3 h-3" /> Expires {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
          {cert.credentialId && (
            <span className="flex items-center gap-1.5">
              <Hash className="w-3 h-3" /> {cert.credentialId}
            </span>
          )}
        </div>
        {cert.verifyUrl && (
          <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <ExternalLink className="w-3 h-3" /> Verify
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default React.memo(CertificateCard);
