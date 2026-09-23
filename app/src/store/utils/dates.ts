export const isoDate = (value: Date = new Date()) =>
  value.toISOString().slice(0, 10);

export const daysAgo = (count: number) => {
  const date = new Date();
  date.setDate(date.getDate() - count);
  return isoDate(date);
};

export const greetingForNow = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const formatClock = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const formatShortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const userInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';
  const initials = `${first}${last}`.toUpperCase();
  if (initials) return initials;
  return (email?.trim()?.[0] ?? 'N').toUpperCase();
};
