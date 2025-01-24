import { HeatmapStatsProps } from './types';

const HeatmapStats: React.FC<HeatmapStatsProps> = ( {yearData} ) => {
  return (
    <div className="mb-4 text-lg">
      <h2 className="font-bold text-xl mb-2">{yearData.yearLabel}</h2>
      <div className="flex gap-4">
        <div>
          <span className="font-semibold">Total Conversations:</span>{' '}
          {yearData.total_conversations.toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Total Messages:</span>{' '}
          {yearData.total_messages.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default HeatmapStats;