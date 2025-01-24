import { DailyCount } from './types';
import { YearData, ColumnDatum, BinDatum } from '@/components/heatmap/types';
import { WEEKS_IN_YEAR } from '@/components/heatmap/constant';

const getDayOfWeek = (date: Date): number => date.getDay();

const convertYearData = (year: number, dailyCounts: DailyCount) => {
  const startDate = new Date(year, 0, 1);  // January 1st

  // Get the first sunday of the calendar view
  const firstSunday = new Date(startDate);
  while (getDayOfWeek(firstSunday) !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

  const weeks: ColumnDatum[] = [];
  let currentDate = new Date(firstSunday);
  let weekIndex = 0;

  while (weekIndex < WEEKS_IN_YEAR) {
    const bins: BinDatum[] = [];
    
    // Generate data for each day of the week
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const binDate = new Date(currentDate);
      binDate.setDate(binDate.getDate() + dayIndex);
      
      // Check if the date is within the target year
      const isEmpty = binDate.getFullYear() !== year;
      
      // Format date to match dailyCounts format (YYYY-MM-DD)
      const dateKey = binDate.toISOString().split('T')[0];
      
      bins.push({
        count: isEmpty ? 0 : (dailyCounts[dateKey] || 0),
        day: dayIndex,
        date: binDate,
        isEmpty
      });
    }

    weeks.push({
      bin: weekIndex,
      bins,
      year
    });

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
    weekIndex++;
  }

  console.log(weeks);
  return weeks;
};

export const convertToHeatmapData = (dailyCounts: DailyCount): YearData[] => {
  // Get the range of years from the data
  const years = new Set(
    Object.keys(dailyCounts).map(date => new Date(date).getFullYear())
  );

  const sortedYears = Array.from(years).sort((a, b) => b - a); // Sort descending

  return sortedYears.map(year => ({
    year,
    data: convertYearData(year, dailyCounts)
  }));
};