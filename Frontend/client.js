
function formatRelative(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.round((d - now) / 60000);
  if (mins < -1440) return `${Math.abs(Math.round(mins/1440))} day(s) ago`;
  if (mins < -60) return `${Math.abs(Math.round(mins/60))} hour(s) ago`;
  if (mins < 0) return `${Math.abs(mins)} min(s) ago`;
  if (mins < 60) return `in ${mins} min(s)`;
  if (mins < 1440) return `in ${Math.round(mins/60)} hour(s)`;
  return `in ${Math.round(mins/1440)} day(s)`;
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.due[data-date]')
    .forEach(el => el.textContent = formatRelative(el.dataset.date));
});
