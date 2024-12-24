export const convertTo24HourFormat = (time: string): string => {
  const [hourMin, period] = time.split(' ');
  const [hours, minutes] = hourMin.split(':').map(Number);

  let formattedHours = hours;
  if (period === 'PM' && hours !== 12) formattedHours += 12;
  if (period === 'AM' && hours === 12) formattedHours = 0;

  return `${formattedHours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Checks if a given time is within a specified range.
 */
export const isTimeWithinRange = (
  currentTime: string,
  startTime: string,
  endTime: string
): boolean => {
  const current = convertTo24HourFormat(currentTime);
  const start = convertTo24HourFormat(startTime);
  const end = convertTo24HourFormat(endTime);

  return current >= start && current <= end;
};
