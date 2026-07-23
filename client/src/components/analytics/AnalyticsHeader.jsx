import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import DateRangePicker from './DateRangePicker';
import ExportMenu from './ExportMenu';

export default function AnalyticsHeader({ dateRange, onDateRangeChange, onRefresh, onExportCSV, onExportPDF, loading }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your coding productivity and performance.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        <Button
          variant="secondary"
          size="icon"
          onClick={onRefresh}
          loading={loading}
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <ExportMenu onExportCSV={onExportCSV} onExportPDF={onExportPDF} />
      </div>
    </div>
  );
}
