export interface BinDatum {
  count: number; // conversations each day
  day: number; // day of the week (0-6)
}

export interface ColumnDatum {
  bin: number; // week (0-51)
  bins: BinDatum[];
	// year: number;
}

export interface YeatData {
	year: number;
	data: ColumnDatum[];
}

export interface HeatmapProps {
  width: number;
}

export interface TooltipData {
  week: number;
  day: string;
  count: number;
  x: number;
  y: number;
}