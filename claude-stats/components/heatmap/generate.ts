"use client"

import { BinDatum, ColumnDatum, YearData } from './types';

const getDayOfWeek = (date: Date): number => date.getDay();

// Generate fake data
const generateYearData = (year: number): ColumnDatum[] => {
	const startDate = new Date(year, 0, 1);  // January 1st

	// Get the first sunday of the calendar view
	const firstSunday = new Date(startDate);
	while (getDayOfWeek(firstSunday) !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

	const weeks: ColumnDatum[] = [];
  let currentDate = new Date(firstSunday);
  let weekIndex = 0;

	while (weekIndex < 53) {
    const bins: BinDatum[] = [];
    
    // Generate data for each day of the week
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const binDate = new Date(currentDate);
      binDate.setDate(binDate.getDate() + dayIndex);
      
      // Check if the date is within the target year
      const isEmpty = binDate.getFullYear() !== year;
      
      bins.push({
        count: isEmpty ? 0 : Math.floor(Math.random() * 100),
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
		console.log("calculating..")
  }

  return weeks;
};

// Generate data for multiple years
export const generateMultiYearData = (): YearData[] => {
  const currentYear = new Date().getFullYear();
  return [
    { year: currentYear, data: generateYearData(currentYear) },
    { year: currentYear - 1, data: generateYearData(currentYear - 1) }
  ];
};