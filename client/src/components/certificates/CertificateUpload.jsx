import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SectionHeader from '../ui/SectionHeader';
import { X, Upload, CalendarDays, Link, Hash, FileText } from 'lucide-react';

const CATEGORY_COLORS = {
  AWS: 'bg-orange-50 text-orange-700 ring-orange-500/10',
  Google: 'bg-blue-50 text-blue-700 ring-blue-500/10',
  Microsoft: 'bg-sky-50 text-sky-700 ring-sky-500/10',
  Coursera: 'bg-indigo-50 text-indigo-700 ring-indigo-500/10',
  Udemy: 'bg-purple-50 text-purple-700 ring-purple-500/10',
  NPTEL: 'bg-green-50 text-green-700 ring-green-500/10',
  Other: 'bg-slate-50 text-slate-700 ring-slate-500/10',
};

function CertificateUpload({ onAdd, onClose, categories }) {
  const [form, setForm] = useState({
    name: '', organization: '', category: 'Other', issueDate: '',
    expiryDate: '', credentialId: '', verifyUrl: '', image: '', notes: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('image', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.organization) return;
    onAdd(form);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh] overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200"
        initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Add Certificate</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Certificate Name *" value={form.name} onChange={(e) => update('name', e.target.value)} icon={FileText} placeholder="AWS Cloud Practitioner" containerClassName="sm:col-span-2" />
            <Input label="Organization *" value={form.organization} onChange={(e) => update('organization', e.target.value)} placeholder="Amazon Web Services" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                {(categories || []).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Issue Date" value={form.issueDate} onChange={(e) => update('issueDate', e.target.value)} icon={CalendarDays} type="date" />
            <Input label="Expiry Date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} icon={CalendarDays} type="date" hint="Leave empty if no expiry" />
            <Input label="Credential ID" value={form.credentialId} onChange={(e) => update('credentialId', e.target.value)} icon={Hash} placeholder="ABC-123-XYZ" />
            <Input label="Verification URL" value={form.verifyUrl} onChange={(e) => update('verifyUrl', e.target.value)} icon={Link} placeholder="https://..." containerClassName="sm:col-span-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate Image</label>
            <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-500">{form.image ? 'Image selected' : 'Click to upload'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {form.image && (
              <div className="mt-2 relative">
                <img src={form.image} alt="Preview" className="h-20 rounded-lg object-cover" />
                <button type="button" onClick={() => update('image', '')} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="primary" size="sm" disabled={!form.name || !form.organization}>Add Certificate</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(CertificateUpload);
