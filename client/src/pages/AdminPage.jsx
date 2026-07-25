import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { useAdmin } from '../hooks/useAdmin';
import {
  AdminStats, UserGrowthChart, PlatformStatsChart,
  UsersTable, RecentRegistrations, PlatformUsageCards, AdminSkeleton,
} from '../components/admin';

export default function AdminPage() {
  const {
    users, stats, growthData, dailyData, recentUsers,
    search, setSearch, statusFilter, setStatusFilter,
    sortBy, setSortBy, deleteUser, toggleSuspend,
  } = useAdmin();
  const [loading] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage users, monitor platform health, and track growth.</p>
        </div>

        {loading ? <AdminSkeleton /> : (
          <>
            <AdminStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              <div className="lg:col-span-2">
                <UserGrowthChart data={growthData} />
              </div>
              <RecentRegistrations users={recentUsers} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              <div className="lg:col-span-2">
                <PlatformStatsChart data={dailyData} />
              </div>
              <PlatformUsageCards stats={stats} />
            </div>

            <UsersTable
              users={users}
              onDelete={deleteUser}
              onSuspend={toggleSuspend}
              search={search} setSearch={setSearch}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              sortBy={sortBy} setSortBy={setSortBy}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}
