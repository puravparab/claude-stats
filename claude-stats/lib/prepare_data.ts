import { ColumnDatum, YearData } from "@/components/heatmap/types";
import { Conversation, DailyCountData } from "./types";


// Get the number of messages sent each day
const getMsgCountForEachDay = (conversations: Conversation[]): {
	dailyCount: DailyCountData;
  years: Set<number>;
} => {
	const dailyCount: DailyCountData = {};
	const years = new Set<number>();

	conversations.forEach(conversation => {
		// Track conversation
		const convDate = new Date(conversation.created_at);
		const convDateKey = convDate.toISOString().split('T')[0];
		if (!dailyCount[convDateKey]) {
      dailyCount[convDateKey] = {
				num_messages_started: 0, 
				num_conversations_started: 0 
			};
    }
		dailyCount[convDateKey].num_conversations_started++;
    years.add(convDate.getFullYear());

		// Track messages
    conversation.chat_messages.forEach(message => {
      const msgDate = new Date(message.created_at);
      const msgDateKey = msgDate.toISOString().split('T')[0];
      if (!dailyCount[msgDateKey]) {
        dailyCount[msgDateKey] = { 
					num_messages_started: 0, 
					num_conversations_started: 0 
				};
      }
      dailyCount[msgDateKey].num_messages_started++;
      years.add(msgDate.getFullYear());
    });
  });

	return { dailyCount, years };
};

const createYearlyData = (
	startDate: Date,
	endDate: Date,
	dailyCount: DailyCountData
): ColumnDatum[] => {
	// Get the first sunday of the calendar view 
	// (Note: this could be in the previous year)
	const firstSunday = new Date(startDate);
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

	const weeks: ColumnDatum[] = [];
  let currentDate = new Date(firstSunday);
  let weekIndex = 0;
	// Iterate through every week and populate daily data
	while (currentDate <= endDate) {
    const bins = Array.from({ length: 7 }, (_, dayIndex) => {
      const binDate = new Date(currentDate);
      binDate.setDate(binDate.getDate() + dayIndex);
      
      const isEmpty = binDate < startDate || binDate > endDate;
      const dateKey = binDate.toISOString().split('T')[0];
      
      return {
        count: isEmpty ? 0 : (dailyCount[dateKey] || 0),
        date: binDate,
				day: dayIndex,
        isEmpty,
				num_conversations: isEmpty ? 0 : (dailyCount[dateKey]?.num_conversations_started || 0),
				num_messages: isEmpty ? 0 : (dailyCount[dateKey]?.num_messages_started || 0)
      };
    });

    weeks.push({
      bin: weekIndex,
      bins,
      year: startDate.getFullYear()
    });

		// go to the next week
    currentDate.setDate(currentDate.getDate() + 7);
    weekIndex++;
  }
	return weeks;
}

const convertToHeatmapFormat = (
  dailyCount: DailyCountData,
  years: Set<number>
): YearData[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 365); // rolling 365 days

	// For rolling year view, we need to calculate totals differently
  const getRollingYearTotals = () => {
    let total_messages = 0;
    let total_conversations = 0;
    Object.entries(dailyCount).forEach(([date, counts]) => {
      const currentDate = new Date(date);
      if (currentDate >= startDate && currentDate <= endDate) {
        total_messages += counts.num_messages_started;
        total_conversations += counts.num_conversations_started;
      }
    });
    return { total_messages, total_conversations };
  };

  // Calculate yearly totals
  const getYearTotals = (year: number) => {
    let total_messages = 0;
    let total_conversations = 0;
    Object.entries(dailyCount).forEach(([date, counts]) => {
      if (new Date(date).getFullYear() === year) {
        total_messages += counts.num_messages_started;
        total_conversations += counts.num_conversations_started;
      }
    });
    return { total_messages, total_conversations };
  };

	// Process rolling year
  const rollingYearTotals = getRollingYearTotals();
  const rollingYearData: YearData = {
    year: null,
		yearLabel: "Last Year",
    data: createYearlyData(startDate, endDate, dailyCount),
    ...rollingYearTotals
  };

	// process every year
  const yearlyData = Array.from(years)
    .sort((a, b) => b - a)
    .map(year => ({
      year,
			yearLabel: `${year}`,
      data: createYearlyData(
        new Date(year, 0, 1), // January 1st
        new Date(year, 11, 31), // December 31st
        dailyCount
      ),
      ...getYearTotals(year)
    }));

  return [rollingYearData, ...yearlyData];
};

const getHeatmapData = (
	conversations: Conversation[]
): YearData[]=> {
	// Get daily message and conversation counts
	const { dailyCount, years } = getMsgCountForEachDay(conversations);

	return convertToHeatmapFormat(dailyCount, years);
};

export default getHeatmapData;