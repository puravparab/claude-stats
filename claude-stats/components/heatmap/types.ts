export interface BinDatum {
	date: Date;   // actual date
  day: number; // day of the week (0: Sunday, 6: Saturday)
  isEmpty: boolean; // to handle empty cells
  num_conversations: number; // number of conversations each day
  num_messages: number // number of messages sent each day
  num_messages_human: number // number of messages sent by human
  num_messages_assistant: number // number of messages sent by assistant 
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
  total_messages_human: number; // number of messages sent by human
  input_tokens: number // number of input tokens
  total_messages_assistant: number; // number of messages sent by assistant
  output_tokens: number // number of output tokens
}

export interface HeatmapProps {
  width: number;
  data: YearData;
  minColor: string;
  maxColor: string;
}

export interface TooltipData {
	date: Date;
  week: number;
  day: string;
  count: number;
  x: number;
  y: number;
}

export interface TooltipProps {
  data: TooltipData | null;
  offsetX?: number;
  offsetY?: number;
}

export interface HeatmapContainerProps {
  data: YearData[];

}

export interface HeatmapStatsProps {
  yearData: YearData;
}