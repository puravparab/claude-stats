"use client"

import { useRef, useEffect, useState } from 'react';
import Heatmap from "../components/heatmap/heatmap"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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

  return (
    <div 
      className="
        font-serif
        min-h-screen
        flex
        items-start
        justify-center
        align-items-center
        m-2
      "
    >
      <main 
        className="flex flex-col justify-center align-top w-full sm:w-2/3 gap m-8"
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
          {width > 0 && <Heatmap width={width} />}
        </div>
      </main>
      <footer className="">
  
      </footer>
    </div>
  );
}
