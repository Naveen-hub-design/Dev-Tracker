import { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { downloadHTML, downloadZIP } from '../utils/portfolioExport';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { AlertTriangle, Download, Printer, Palette, Moon, Sun, Globe, Code2, Sparkles, FileDown } from 'lucide-react';
import { PortfolioEditor, PortfolioPreview, PortfolioSkeleton } from '../components/portfolio';

const THEMES = [
  { id: 'minimal', label: 'Minimal', color: 'bg-blue-500' },
  { id: 'developer', label: 'Developer', color: 'bg-sky-500' },
  { id: 'glass', label: 'Glass', color: 'bg-violet-500' },
  { id: 'modern', label: 'Modern', color: 'bg-emerald-500' },
];

export default function PortfolioPage() {
  const { portfolio, theme, darkMode, loading, updatePersonal, setTheme, setDarkMode } = usePortfolio();
  const [exporting, setExporting] = useState(false);

  if (loading) {
    return (
      <PageContainer title="Portfolio Generator">
        <PortfolioSkeleton />
      </PageContainer>
    );
  }

  if (!portfolio?.personal?.name && !portfolio?.projects?.length) {
    return (
      <PageContainer title="Portfolio Generator">
        <EmptyState
          icon={AlertTriangle}
          title="No data available"
          description="Connect your GitHub and LeetCode accounts in Settings to generate your portfolio."
          action={<Button onClick={() => window.location.href = '/settings'} variant="primary" size="sm">Go to Settings</Button>}
        />
      </PageContainer>
    );
  }

  const handleExportHTML = async () => {
    setExporting(true);
    try { downloadHTML(portfolio, theme, darkMode); }
    finally { setExporting(false); }
  };

  const handleExportZIP = async () => {
    setExporting(true);
    try { await downloadZIP(portfolio, theme, darkMode); }
    finally { setExporting(false); }
  };

  return (
    <PageContainer
      title="Portfolio Generator"
      subtitle="Generate a personal portfolio from your DevTrack data"
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={handleExportHTML} variant="secondary" size="sm" loading={exporting}>
            <FileDown className="w-4 h-4 mr-1" /> Export HTML
          </Button>
          <Button onClick={handleExportZIP} variant="primary" size="sm" loading={exporting}>
            <Download className="w-4 h-4 mr-1" /> Download ZIP
          </Button>
        </div>
      }
    >
      {/* Theme + Dark Mode Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
          </div>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  theme === t.id                     ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${t.color}`} />
                {t.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <PortfolioEditor portfolio={portfolio} updatePersonal={updatePersonal} />
        </div>

        {/* Preview */}
        <div className="hidden lg:block sticky top-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Live Preview
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{theme} {darkMode ? '· dark' : ''}</span>
            </div>
            <div className="p-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              <PortfolioPreview portfolio={portfolio} theme={theme} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="lg:hidden">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Live Preview
            </span>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            <PortfolioPreview portfolio={portfolio} theme={theme} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
