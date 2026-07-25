import React from 'react';
import CertificateCard from './CertificateCard';

function CertificateGrid({ certs, onSelect, onDelete }) {
  if (!certs?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-400">No certificates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {certs.map((cert) => (
        <CertificateCard key={cert.id} cert={cert} onClick={onSelect} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default React.memo(CertificateGrid);
