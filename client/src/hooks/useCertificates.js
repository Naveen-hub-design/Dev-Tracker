import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'devtrack_certificates';

const CATEGORIES = ['AWS', 'Google', 'Microsoft', 'Coursera', 'Udemy', 'NPTEL', 'Other'];

const DEMO_CERTS = [
  { id: '1', name: 'AWS Cloud Practitioner', organization: 'AWS', category: 'AWS', issueDate: '2025-06-15', expiryDate: '2028-06-15', credentialId: 'AWS-CP-2025-XXXXX', verifyUrl: 'https://aws.amazon.com/verification', image: null, notes: 'Foundational cloud knowledge certification.' },
  { id: '2', name: 'Google Data Analytics', organization: 'Google', category: 'Google', issueDate: '2025-09-20', expiryDate: '', credentialId: 'GDA-2025-YYYYY', verifyUrl: 'https://coursera.org/verify', image: null, notes: 'Professional data analytics specialization.' },
  { id: '3', name: 'Python for Everybody', organization: 'Coursera', category: 'Coursera', issueDate: '2025-03-10', expiryDate: '', credentialId: 'PFE-2025-ZZZZZ', verifyUrl: 'https://coursera.org/verify', image: null, notes: 'University of Michigan Python specialization.' },
  { id: '4', name: 'React - The Complete Guide', organization: 'Udemy', category: 'Udemy', issueDate: '2025-01-05', expiryDate: '', credentialId: 'UDM-REACT-001', verifyUrl: 'https://udemy.com/certificate', image: null, notes: 'Comprehensive React course by Maximilian.' },
];

function loadCerts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEMO_CERTS;
}

function saveCerts(certs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
}

export function useCertificates() {
  const [certs, setCerts] = useState(loadCerts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => { saveCerts(certs); }, [certs]);

  const addCert = useCallback((cert) => {
    const newCert = { ...cert, id: Date.now().toString() };
    setCerts((prev) => [newCert, ...prev]);
    setShowUpload(false);
  }, []);

  const updateCert = useCallback((id, updates) => {
    setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCert = useCallback((id) => {
    setCerts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const filtered = useMemo(() => {
    let result = [...certs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.organization?.toLowerCase().includes(q) ||
        c.credentialId?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter);
    }
    switch (sortBy) {
      case 'oldest': result.sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'org': result.sort((a, b) => a.organization.localeCompare(b.organization)); break;
      case 'newest': default: result.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)); break;
    }
    return result;
  }, [certs, search, categoryFilter, sortBy]);

  const stats = useMemo(() => ({
    total: certs.length,
    active: certs.filter((c) => !c.expiryDate || new Date(c.expiryDate) > new Date()).length,
    expiringSoon: certs.filter((c) => c.expiryDate && new Date(c.expiryDate) > new Date() && (new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) < 90).length,
    categories: [...new Set(certs.map((c) => c.category))].length,
  }), [certs]);

  return {
    certs: filtered, allCerts: certs, stats, search, setSearch,
    categoryFilter, setCategoryFilter, sortBy, setSortBy,
    showUpload, setShowUpload, addCert, updateCert, deleteCert,
    CATEGORIES,
  };
}
