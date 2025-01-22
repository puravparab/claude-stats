export const WEEKS_IN_YEAR = 52;
export const DAYS_IN_WEEK = 7;

import { BinDatum, ColumnDatum, HeatmapProps, TooltipData } from './types';

// Generate fake data
export const generateWeekData = (): ColumnDatum[] => {
  return Array.from({length: WEEKS_IN_YEAR}, (_, weekIndex) => ({
    bin: weekIndex, // each day
    bins: Array.from({length: DAYS_IN_WEEK}, (_, dayIndex) => ({
      day: dayIndex,
      count: Math.floor(Math.random() * 100) // random activity count
    }))
  }))
};