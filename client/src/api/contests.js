import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
});

export const fetchUpcomingContests = async (platform = 'all') => {
  const res = await API.get(`/contests/upcoming?platform=${encodeURIComponent(platform)}`);
  return res.data;
};

/**
 * Generate a 1-click Google Calendar add-event URL
 */
export function generateGoogleCalendarUrl(contest = {}) {
  const {
    name = 'Competitive Programming Contest',
    startTime = new Date().toISOString(),
    durationSeconds = 7200,
    url = 'https://devtrack.io',
    platform = 'Contest',
  } = contest || {};

  try {
    const start = new Date(startTime);
    const validStart = isNaN(start.getTime()) ? new Date() : start;
    const end = new Date(validStart.getTime() + (Number(durationSeconds) || 7200) * 1000);

    const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const datesParam = `${formatGCalDate(validStart)}/${formatGCalDate(end)}`;
    const platName = (platform || 'Contest').toUpperCase();
    const title = encodeURIComponent(`[${platName}] ${name}`);
    const details = encodeURIComponent(
      `Live Competitive Programming Contest on ${platName}.\n\nRegistration & Problems: ${url}\n\nSynced via DevTrack — Developer Productivity & Career Placement Readiness.`
    );
    const location = encodeURIComponent(url || '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
  } catch (e) {
    console.error('Failed to generate Google Calendar URL:', e);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  }
}
