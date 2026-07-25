import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Input from '../ui/Input';

function CertificateFilters({ search, setSearch, categoryFilter, setCategoryFilter, sortBy, setSortBy, categories }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          placeholder="Search certificates..."
          containerClassName="mb-0"
        />
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
          >
            <option value="all">All Categories</option>
            {(categories || []).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name</option>
            <option value="org">Organization</option>
          </select>
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CertificateFilters);
