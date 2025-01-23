"use client"

import { useState, useCallback } from 'react';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear } from '@visx/scale';

import { generateMultiYearData } from './generate';
import { Tooltip } from './tooltip';
import { YearData, HeatmapProps, TooltipData } from './types';
import { WEEKS_IN_YEAR, YEAR_HEIGHT, MARGIN, DAY_LABELS, MONTH_LABELS } from './constant';


const Heatmap: React.FC<HeatmapProps> = ({ width, data }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent, bin: any, DAY_LABELS: string[]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      week: bin.column + 1,
      day: DAY_LABELS[bin.row],
      count: bin.count,
      date: bin.date,
      x: rect.left,
      y: rect.top
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Calculate bin sizes
  const binWidth = Math.max((width - MARGIN.left - MARGIN.right) / WEEKS_IN_YEAR, 10);
  const binHeight = binWidth;
  
  // Scales
  const xScale = (columnIndex: number) => columnIndex * binWidth;
  const yScale = (rowIndex: number) => rowIndex * binHeight;
  
  // Color scale
  const colorScale = scaleLinear<string>({
    domain: [0, 100],
    range: ['#d4bdb6', '#d97757'],
  });
  
  // Opacity scale (optional)
  const opacityScale = scaleLinear<number>({
    domain: [0, 100],
    range: [0.1, 1],
  });

  const totalHeight = YEAR_HEIGHT * data.length + MARGIN.top + MARGIN.bottom;

  return (
    <div className="relative">
      <svg width={width} height={totalHeight}>
        {data.map((yearItem, yearIndex) => (
          <Group 
            key={yearItem.year} 
            top={MARGIN.top + yearIndex * YEAR_HEIGHT} 
            left={MARGIN.left}
          >
            {/* Year label */}
            <text
              x={-30}
              y={-30}
              textAnchor="start"
              fontSize={18}
              fontWeight="bold"
            >
              {yearItem.year}
            </text>

            {/* Day labels */}
            {DAY_LABELS.map((day, i) => (
              <text
                key={`day-${yearItem.year}-${i}`}
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
                key={`month-${yearItem.year}-${i}`}
                x={xScale(i * 4.3)}
                y={-10}
                textAnchor="start"
                fontSize={12}
              >
                {month}
              </text>
            ))}

            <HeatmapRect
              data={yearItem.data}
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
                  heatmapBins.map((bin) => {
                    const binData = yearItem.data[bin.column]?.bins[bin.row];
                    if (!binData || binData.isEmpty) return null;
                    return (
                      <rect
                        key={`heatmap-rect-${yearItem.year}-${bin.row}-${bin.column}`}
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
        ))}
      </svg>

      <Tooltip data={tooltip} />
    </div>
  );
}

export default Heatmap;