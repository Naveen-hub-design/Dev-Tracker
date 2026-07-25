import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { useCertificates } from '../hooks/useCertificates';
import {
  CertificateStats,
  CertificateFilters,
  CertificateGrid,
  CertificateModal,
  CertificateUpload,
  CertificateSkeleton,
} from '../components/certificates';

export default function CertificatesPage() {
  const {
    certs, stats, search, setSearch, categoryFilter, setCategoryFilter,
    sortBy, setSortBy, showUpload, setShowUpload, addCert, deleteCert,
    CATEGORIES,
  } = useCertificates();
  const [selected, setSelected] = useState(null);
  const [loading] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">Certificates</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your professional certifications and credentials.</p>
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowUpload(true)}>
            Add Certificate
          </Button>
        </div>

        <CertificateStats data={stats} />

        <CertificateFilters
          search={search} setSearch={setSearch}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          sortBy={sortBy} setSortBy={setSortBy}
          categories={CATEGORIES}
        />

        {loading ? (
          <CertificateSkeleton />
        ) : certs.length === 0 ? (
          <Card className="p-12">
            <EmptyState
              icon={Award}
              title="No certificates yet"
              description="Add your first certification to start building your credential wall."
            />
          </Card>
        ) : (
          <CertificateGrid certs={certs} onSelect={setSelected} onDelete={deleteCert} />
        )}
      </div>

      <AnimatePresence>
        {showUpload && <CertificateUpload onAdd={addCert} onClose={() => setShowUpload(false)} categories={CATEGORIES} />}
      </AnimatePresence>

      <AnimatePresence>
        {selected && <CertificateModal cert={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </PageContainer>
  );
}
