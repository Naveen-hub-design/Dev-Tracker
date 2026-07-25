import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, SlidersHorizontal, ArrowUpDown, Trash2, Ban, CheckCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const PAGE_SIZE = 8;

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UsersTable({ users, onDelete, onSuspend, search, setSearch, statusFilter, setStatusFilter, sortBy, setSortBy }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} icon={Search} placeholder="Search users by name, email..." containerClassName="mb-0" />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name</option>
                  <option value="problems">Problems</option>
                  <option value="streak">Streak</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Platforms</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Problems</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Streak</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.map((user) => (
                  <motion.tr
                    key={user.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${getAvatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate text-xs">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {user.github && <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white text-[9px] font-bold">GH</span>}
                        {user.leetcode && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold">LC</span>}
                        {user.hackerrank && <span className="px-1.5 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold">HR</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs font-medium text-slate-700">{user.problemsSolved}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs font-medium text-slate-700">{user.streak}d</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/10' : 'bg-red-50 text-red-700 ring-1 ring-red-500/10'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSuspend(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${user.status === 'suspended' ? 'hover:bg-emerald-50 text-emerald-500' : 'hover:bg-amber-50 text-amber-500'}`}
                          title={user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        >
                          {user.status === 'suspended' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No users found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, users.length)} of {users.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default React.memo(UsersTable);
