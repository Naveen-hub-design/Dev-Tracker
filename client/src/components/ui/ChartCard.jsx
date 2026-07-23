import Card from './Card';
import SectionHeader from './SectionHeader';

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <Card className={className}>
      {(title || action) && (
        <div className="mb-4">
          <SectionHeader title={title} subtitle={subtitle} action={action} />
        </div>
      )}
      {children}
    </Card>
  );
}
