"use client"

import { useRef, useEffect, useState } from 'react';
import { DailyCount, ConversationStats } from '@/lib/types';
// import { processConversations, calculateStats } from '@/lib/process';
import getHeatmapData from '@/lib/prepare_data';
import Heatmap from "@/components/heatmap/heatmap"
import { YearData } from '@/components/heatmap/types';
import processJson from '@/lib/process_json';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [data, setData] = useState<YearData[]>([]);
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
        if (!res.ok) {
          console.log(res);
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then(conversations => {
        console.log(conversations);
        const heatmapData = getHeatmapData(conversations);
        console.log(heatmapData)
        setData(heatmapData);
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
          {/* {!loading && !error && width > 0 && data.length > 0 && (
            <Heatmap width={width} data={data} />
          )} */}
        </div>
      </main>
      <footer className="">
  
      </footer>
    </div>
  );
}
