import { HeatmapStatsProps } from './types';

const HeatmapStats: React.FC<HeatmapStatsProps> = ( {yearData} ) => {
  const abbreviateNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}K`;
    return num.toString();
  }
  return (
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-[--primary-color] font-bold text-2xl">
        {yearData.yearLabel}
      </h2>
      
      <div className="flex flex-row gap-4 overflow-x-auto">
        <div className="flex flex-col bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm min-w-fit">
          <div className="text-sm text-gray-600 whitespace-nowrap">Conversations</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {abbreviateNumber(yearData.total_conversations)}
          </div>
        </div>

        <div className="flex flex-col bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm min-w-fit">
          <div className="text-sm text-gray-600 whitespace-nowrap">Prompts sent</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {abbreviateNumber(yearData.total_messages_human)}
          </div>
        </div>

        <div className="flex flex-col bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm min-w-fit">
          <div className="text-sm text-gray-600 whitespace-nowrap">Input tokens</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {abbreviateNumber(yearData.input_tokens)}
          </div>
        </div>

        <div className="flex flex-col bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm min-w-fit">
          <div className="text-sm text-gray-600 whitespace-nowrap">Output tokens</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {abbreviateNumber(yearData.output_tokens)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapStats;