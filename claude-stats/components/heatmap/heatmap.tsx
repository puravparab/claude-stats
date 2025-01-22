import { useState, useCallback, memo, useMemo } from 'react';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';
import { BinDatum, ColumnDatum, HeatmapProps, TooltipData } from './types';

const HEIGHT = 200;  // Reduced since we only need 7 rows
const WEEKS_IN_YEAR = 52;
const DAYS_IN_WEEK = 7;
const MARGIN = { top: 40, right: 0, bottom: 20, left: 40 };

// Generate fake data
const generateWeekData = (): ColumnDatum[] => {
  return Array.from({length: WEEKS_IN_YEAR}, (_, weekIndex) => ({
    bin: weekIndex, // each day
    bins: Array.from({length: DAYS_IN_WEEK}, (_, dayIndex) => ({
      day: dayIndex,
      count: Math.floor(Math.random() * 100) // random activity count
    }))
  }))
};

const Tooltip = memo(({ data }: { data: TooltipData | null }) => {
  if (!data) return null;
  return (
    <div 
      className="absolute flex flex-col bg-white w-24 border-2 border-stone-50 border-rounded px-2 py-2 rounded shadow-lg text-sm z-40 pointer-events-none"
      style={{
        left: data.x - 250 + 'px',
        top: data.y - 100 + 'px',
      }}
    >
      <p>Week: {data.week}</p>
      <p>Day: {data.day}</p>
      <p>Count: {data.count}</p>
    </div>
  );
});

const Heatmap: React.FC<HeatmapProps> = ({ width }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent, bin: any, dayLabels: string[]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      week: bin.column + 1,
      day: dayLabels[bin.row],
      count: bin.count,
      x: rect.left,
      y: rect.top
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const data = useMemo(() => generateWeekData(), []);

  // Calculate bin sizes
  const binWidth = Math.min((width - MARGIN.left - MARGIN.right) / WEEKS_IN_YEAR, 20);
  const binHeight = binWidth;
  
  // Scales
  const xScale = (columnIndex: number) => columnIndex * binWidth;
  const yScale = (rowIndex: number) => rowIndex * binHeight;
  
  // Color scale
  const colorScale = scaleLinear<string>({
    domain: [0, 100],
    range: ['#fff5f0', '#d97757'],
  });
  
  // Opacity scale (optional)
  const opacityScale = scaleLinear<number>({
    domain: [0, 100],
    range: [0.1, 1],
  });

  // Day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Month labels
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="relative">
      <svg width={width} height={HEIGHT}>
        <Group top={MARGIN.top} left={MARGIN.left}>
          {/* Day labels */}
          {dayLabels.map((day, i) => (
            <text
              key={`day-${i}`}
              x={-10}
              y={yScale(i) + binHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={12}
            >
              {day}
            </text>
          ))}

          {/* Month labels */}
          {monthLabels.map((month, i) => (
            <text
              key={`month-${i}`}
              x={xScale(i * 4.3)} // Approximate week positions
              y={-10}
              textAnchor="start"
              fontSize={12}
            >
              {month}
            </text>
          ))}

          <HeatmapRect
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={2}
            bins={(d) => d.bins}
            count={(d) => d.count}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => (
                  <rect
                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                    x={bin.x}
                    y={bin.y}
                    width={bin.width}
                    height={bin.height}
                    fill={bin.color}
                    opacity={bin.opacity}
                    rx={2}
                    onMouseEnter={(e) => handleMouseEnter(e, bin, dayLabels)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))
              )
            }
          </HeatmapRect>
        </Group>
      </svg>
      <Tooltip data={tooltip} />
    </div>
  );
}

export default Heatmap;