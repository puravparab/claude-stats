"use client"

import { useState, useCallback } from 'react';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';
import { Tooltip } from './tooltip';
import { HeatmapProps, TooltipData } from './types';
import { 
  WEEKS_IN_YEAR, 
  YEAR_HEIGHT, 
  MARGIN, 
  DAY_LABELS,
  MONTH_LABELS 
} from './constant';


const Heatmap: React.FC<HeatmapProps> = ({ width, data, minColor, maxColor }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // When user hovers over a day cell
  const handleMouseEnter = useCallback((e: React.MouseEvent, bin: any, DAY_LABELS: string[]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      week: bin.column + 1,
      day: DAY_LABELS[bin.row],
      count: bin.count,
      date: bin.date,
      x: rect.left,
      y: rect.top,
    });
  }, []);
  // When the user hovers out
  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Calculate max daily conversations
  const maxDailyConvos = Math.max(
    ...data.data.flatMap(week => 
      week.bins.map(day => day.num_messages_human || 0)
    )
  );

  // Calculate bin sizes
  const binWidth = Math.max((width - MARGIN.left - MARGIN.right) / WEEKS_IN_YEAR, 10);
  const binHeight = binWidth;
  
  // Scales
  const xScale = (columnIndex: number) => columnIndex * binWidth;
  const yScale = (rowIndex: number) => rowIndex * binHeight;
  
  // Color scale
  const colorScale = scaleLinear<string>({
    domain: [1, Math.max(maxDailyConvos, 1)],
    range: [minColor, maxColor],
  });
  
  // Opacity scale (optional)
  const opacityScale = scaleLinear<number>({
    domain: [0, Math.max(maxDailyConvos, 100)],
    range: [0.2, 100],
  });

  return (
    <div className="relative">
      <svg width={width} height={YEAR_HEIGHT}>
        <Group 
          top={MARGIN.top} 
          left={MARGIN.left}
        >
          {/* Day labels */}
          {DAY_LABELS.map((day, i) => (
            <text
              key={`day-${data.year}-${i}`}
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
          {MONTH_LABELS.map((month, i) => (
            <text
              key={`month-${data.year}-${i}`}
              x={xScale(i * 4.3)}
              y={-10}
              textAnchor="start"
              fontSize={12}
            >
              {month}
            </text>
          ))}

          <HeatmapRect
            data={data.data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={2}
            bins={(d) => d.bins}
            count={(d) => d.num_messages_human}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => {
                  const binData = data.data[bin.column]?.bins[bin.row];
                  if (!binData || binData.isEmpty) return null;
                  return (
                    <rect
                      key={`heatmap-rect-${data.year}-${bin.row}-${bin.column}`}
                      x={bin.x}
                      y={bin.y}
                      width={bin.width}
                      height={bin.height}
                      fill={bin.color}
                      opacity={bin.opacity}
                      rx={2}
                      onMouseEnter={(e) => handleMouseEnter(e, {...bin, date: binData.date}, DAY_LABELS)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
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