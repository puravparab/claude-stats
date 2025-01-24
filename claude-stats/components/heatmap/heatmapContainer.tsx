import { useRef, useEffect, useState } from 'react';
import Heatmap from './heatmap';
import HeatmapStats from './heatmapStats';
import { HeatmapContainerProps } from "./types";

const HeatmapContainer: React.FC<HeatmapContainerProps> = ({ data }) => {
	const [width, setWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculates the width of the heatmap container when resized
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
			ref={containerRef}
			className="flex flex-col gap-0 w-full p-4 z-30"
		>
			{width > 0 && data.map((yearData) => (
        <div key={yearData.year} className="mb-2">
					<HeatmapStats yearData={yearData}/>
          <Heatmap width={width} data={yearData} minColor='#d977577d' maxColor='#d93500'/>
        </div>
      ))}

		</div>
	)
}

export default HeatmapContainer;