"use client"

import { useRef, useEffect, useState } from 'react';
import { DailyCount, ConversationStats } from '@/lib/types';
import { processConversations, calculateStats } from '@/lib/process';
import { convertToHeatmapData } from '@/lib/convert';
import Heatmap from "@/components/heatmap/heatmap"
import { YearData } from '@/components/heatmap/types';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [data, setData] = useState<YearData[]>([]);
  const [stats, setStats] = useState<ConversationStats | null>(null);;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/conversations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(conversations => {
        const processedData = processConversations(conversations);
        const heatmapData = convertToHeatmapData(processedData);
        const statsData = calculateStats(conversations);
        setData(heatmapData);
        setStats(statsData);
        setError(null);
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Failed to load data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div 
      className="
        font-serif
        flex flex-col items-center justify-start
        min-h-screen m-2
      "
    >
      <main 
        className="
          flex flex-col justify-center items-center
          w-full 
          sm:w-2/3 gap-8 m-8
        "
      >
        <h1 className="
          text-center font-extrabold text-lg sm:text-5xl py-2
        ">
          Claude Stats
        </h1>
        <div
          ref={containerRef}
          className="w-full p-2 z-30"
        >
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && width > 0 && data.length > 0 && stats && (
            <Heatmap width={width} data={data} stats={stats} />
          )}
        </div>
      </main>
      <footer className="">
  
      </footer>
    </div>
  );
}
