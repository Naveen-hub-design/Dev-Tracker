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
export function generateGoogleCalendarUrl({ name, startTime, durationSeconds, url, platform }) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + (durationSeconds || 7200) * 1000);

  const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const datesParam = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const title = encodeURIComponent(`[${platform.toUpperCase()}] ${name}`);
  const details = encodeURIComponent(`Live Competitive Programming Contest on ${platform.toUpperCase()}.\n\nRegistration & Problems: ${url}\n\nTracked via DevTrack Platform.`);
  const location = encodeURIComponent(url);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}
