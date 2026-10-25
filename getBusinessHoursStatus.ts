export const getBusinessHoursStatus = (): string => {
  const now = new Date();
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short'
  });
  
  const parts = formatter.formatToParts(now);
  let hour = 0;
  let minute = 0;
  let weekday = '';
  
  for (const part of parts) {
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
    if (part.type === 'weekday') weekday = part.value;
  }

  const openHour = 9;
  const closeHour = 17; // 5 PM
  const isWeekend = weekday === 'Sat' || weekday === 'Sun';

  if (isWeekend) {
    return 'Miami office is currently closed';
  }

  const currentMinutesTotal = hour * 60 + minute;
  const openMinutesTotal = openHour * 60;
  const closeMinutesTotal = closeHour * 60;

  if (currentMinutesTotal < openMinutesTotal) {
    const diff = openMinutesTotal - currentMinutesTotal;
    if (diff <= 60 && diff > 0) {
      return `Miami office opens in ${diff} minutes`;
    }
    return 'Miami office is currently closed';
  } 
  
  if (currentMinutesTotal >= openMinutesTotal && currentMinutesTotal < closeMinutesTotal) {
    const diff = closeMinutesTotal - currentMinutesTotal;
    if (diff <= 60 && diff > 0) {
      return `Miami office closes in ${diff} minutes`;
    }
    return 'Miami office is currently open';
  }

  return 'Miami office is currently closed';
};
