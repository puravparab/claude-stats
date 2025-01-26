import { HeatmapStatsProps } from './types';

const HeatmapStats: React.FC<HeatmapStatsProps> = ( {yearData} ) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-[--primary-color] font-bold text-2xl">
        {yearData.yearLabel}
      </h2>
      
      <div className="grid grid-cols-3 gap-4 max-w-sm">
        <div className="bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm">
          <div className="text-sm text-gray-600">Conversations</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {yearData.total_conversations.toLocaleString()}
          </div>
        </div>

        <div className="bg-[--background] rounded-lg border border-[--primary-color] p-2 shadow-sm">
          <div className="text-sm text-gray-600">Messages</div>
          <div className="text-[--primary-color] text-xl font-semibold">
            {yearData.total_messages.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapStats;