export interface BinDatum {
	date: Date;   // actual date
  day: number; // day of the week (0: Sunday, 6: Saturday)
  isEmpty: boolean; // to handle empty cells
  num_conversations: number; // number of conversations each day
  num_messages: number // number of messages sent each day
}

export interface ColumnDatum {
  bin: number; // week (0-51)
  bins: BinDatum[];
	year: number;
}

export interface YearData {
	year: number | null;
  yearLabel?: string
	data: ColumnDatum[];
  total_conversations: number; // total number of conversations for the year
  total_messages: number; // total number of messages for the year
}

export interface HeatmapProps {
  width: number;
  data: YearData[];
}

export interface TooltipData {
	date: Date;
  week: number;
  day: string;
  count: number;
  x: number;
  y: number;
}