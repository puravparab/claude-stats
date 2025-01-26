"use client"

import { memo } from 'react';
import { TooltipProps } from './types';

export const Tooltip = memo(({ data, offsetX = 10, offsetY = -40 }: TooltipProps) => {
  if (!data) return null;
  return (
    <div 
      className="flex flex-col bg-white w-52 border-2 border-stone-50 border-rounded px-2 py-2 rounded-lg shadow-lg text-sm z-40 pointer-events-none"
      style={{
        left: `${data.x + offsetX}px`,
        top: `${data.y + offsetY}px`,
        position: 'fixed'
      }}
    >
      <p>{data.count} msgs sent on {data.date.toLocaleDateString()}</p>
    </div>
  );
});