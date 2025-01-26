"use client"

import { useEffect, useState } from 'react';
import getHeatmapData from '@/lib/prepare_data';
import HeatmapContainer from "@/components/heatmap/heatmapContainer"
import { YearData } from '@/components/heatmap/types';

export default function Home() {
  const [data, setData] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          w-screen sm:w-11/12 gap-8 my-2 md:my-8 mx-2 sm:mx-4
        "
      >
        <h1 className="
          text-center font-extrabold text-3xl sm:text-5xl py-2
        ">
          Claude Stats
        </h1>

        <HeatmapContainer data={data}/>
      </main>

      <footer className="">
      </footer>
    </div>
  );
}
