// Convert UTC dates to user's locals time
export const getLocalDateKey = (utcDate: string | Date): { dateKey: string; year: number } => {
  const date = new Date(utcDate);
  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return {
    dateKey: localDate.toISOString().split('T')[0],
    year: localDate.getFullYear()
  };
};