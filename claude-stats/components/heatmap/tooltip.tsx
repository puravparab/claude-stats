"use client"

import { memo } from 'react';
import { TooltipData } from './types';

interface TooltipProps {
  data: TooltipData | null;
  offsetX?: number;
  offsetY?: number;
}

export const Tooltip = memo(({ data, offsetX = -250, offsetY = -100 }: TooltipProps) => {
  if (!data) return null;
  return (
    <div 
      className="absolute flex flex-col bg-white w-24 border-2 border-stone-50 border-rounded px-2 py-2 rounded shadow-lg text-sm z-40 pointer-events-none"
      style={{
        left: data.x - 250 + 'px',
        top: data.y - 100 + 'px',
      }}
    >
      <p>{data.date.toLocaleDateString()}</p>
      <p>Week: {data.week}</p>
      <p>Count: {data.count}</p>
    </div>
  );
});