"use client"

import { useEffect, useState } from 'react';
import getHeatmapData from '@/lib/prepare_data';
import HeatmapContainer from "@/components/heatmap/heatmapContainer";
import { YearData } from '@/components/heatmap/types';
import Loading from '@/components/status/loading';
import ErrorComponent from '@/components/status/error';

export default function Home() {
  const [data, setData] = useState<YearData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/conversations')
      .then(res => {
        if (!res.ok) {
          console.log(res);
          setError(true);
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then(conversations => {
        console.log(conversations)
        const heatmapData = getHeatmapData(conversations);
        setData(heatmapData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setIsLoading(false);
        setError(true);
      })
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

        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorComponent />
        ) : (
          <HeatmapContainer data={data} />
        )}
      </main>

      <footer className="">
      </footer>
    </div>
  );
}
