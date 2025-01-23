import { ConversationStats} from '@/lib/types';

export interface BinDatum {
  count: number; // conversations each day
  day: number; // day of the week (0-6)
	date: Date;   // actual date
  isEmpty: boolean; // to handle empty cells
}

export interface ColumnDatum {
  bin: number; // week (0-51)
  bins: BinDatum[];
	year: number;
}

export interface YearData {
	year: number;
	data: ColumnDatum[];
}

export interface HeatmapProps {
  width: number;
  data: YearData[];
  stats: ConversationStats;
}

export interface TooltipData {
	date: Date;
  week: number;
  day: string;
  count: number;
  x: number;
  y: number;
}