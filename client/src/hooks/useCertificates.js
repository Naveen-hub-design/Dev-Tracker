import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchCertificates,
  addCertificate,
  editCertificate,
  removeCertificate,
} from '../api/certificates';

const CATEGORIES = ['AWS', 'Google', 'Microsoft', 'Coursera', 'Udemy', 'NPTEL', 'Other'];

export function useCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showUpload, setShowUpload] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCertificates();
      setCerts(data);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCert = useCallback(async (cert) => {
    try {
      const created = await addCertificate(cert);
      setCerts((prev) => [created, ...prev]);
      setShowUpload(false);
    } catch (err) {
      console.error('Failed to add certificate:', err);
    }
  }, []);

  const updateCert = useCallback(async (id, updates) => {
    try {
      const updated = await editCertificate(id, updates);
      setCerts((prev) => prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updated } : c)));
    } catch (err) {
      console.error('Failed to update certificate:', err);
    }
  }, []);

  const deleteCert = useCallback(async (id) => {
    try {
      await removeCertificate(id);
      setCerts((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    } catch (err) {
      console.error('Failed to delete certificate:', err);
    }
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
    certs: filtered,
    allCerts: certs,
    loading,
    stats,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    showUpload,
    setShowUpload,
    addCert,
    updateCert,
    deleteCert,
    CATEGORIES,
    refetch: load,
  };
}
