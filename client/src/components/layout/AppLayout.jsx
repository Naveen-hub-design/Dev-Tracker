import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 relative">
      {/* Background ambient lighting for premium depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 dark:bg-indigo-600/8 blur-[130px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 dark:bg-purple-600/5 blur-[120px]" />
      </div>

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
