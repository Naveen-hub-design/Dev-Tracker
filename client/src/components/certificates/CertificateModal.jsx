import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Award, ExternalLink, Calendar, Clock, Hash, X, Copy } from 'lucide-react';

const ORG_GRADIENT = {
  AWS: 'from-orange-500 to-amber-500',
  Google: 'from-blue-500 to-cyan-500',
  Microsoft: 'from-sky-500 to-blue-600',
  Coursera: 'from-indigo-500 to-violet-500',
  Udemy: 'from-purple-500 to-pink-500',
  NPTEL: 'from-green-500 to-emerald-500',
  Other: 'from-slate-500 to-slate-600',
};

function CertificateModal({ cert, onClose }) {
  if (!cert) return null;
  const grad = ORG_GRADIENT[cert.category] || ORG_GRADIENT.Other;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[6vh] overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200"
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className={`h-44 bg-gradient-to-br ${grad} flex items-center justify-center relative overflow-hidden`}>
          {cert.image ? (
            <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" />
          ) : (
            <Award className="w-20 h-20 text-white/20" />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{cert.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{cert.organization}</p>
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset bg-slate-100 text-slate-700`}>
              {cert.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {cert.issueDate && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Issued</p>
                  <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            )}
            {cert.expiryDate && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Expires</p>
                  <p className={`font-medium ${new Date(cert.expiryDate) < new Date() ? 'text-red-600' : ''}`}>
                    {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {cert.credentialId && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
              <Hash className="w-4 h-4 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Credential ID</p>
                <p className="text-sm font-mono font-medium text-slate-700 truncate">{cert.credentialId}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(cert.credentialId)}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}

          {cert.notes && (
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">{cert.notes}</p>
          )}

          {cert.verifyUrl && (
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              <ExternalLink className="w-4 h-4" /> Verify Certificate
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(CertificateModal);
