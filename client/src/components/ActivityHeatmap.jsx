import CalendarHeatmap from 'react-calendar-heatmap';

export default function ActivityHeatmap({ data = [], loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-32 mb-4" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const values = data.length > 0 ? data : generateDemoData();

  return (
    <div className="card">
      <h3 className="section-title">Activity (Last 6 Months)</h3>
      <CalendarHeatmap
        startDate={sixMonthsAgo}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return 'fill-slate-100';
          const count = value.count || 0;
          if (count <= 0) return 'fill-slate-100';
          if (count <= 3) return 'color-scale-1';
          if (count <= 6) return 'color-scale-2';
          if (count <= 9) return 'color-scale-3';
          return 'color-scale-4';
        }}
        titleForValue={(value) => {
          if (!value) return 'No activity';
          return `${value.date}: ${value.count || 0} contributions`;
        }}
      />
    </div>
  );
}

function generateDemoData() {
  const data = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (Math.random() > 0.4) {
      data.push({
        date: date.toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 12) + 1,
      });
    } else {
      data.push({
        date: date.toISOString().slice(0, 10),
        count: 0,
      });
    }
  }
  return data;
}
