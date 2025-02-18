import get_token_count from "./tokenizer";
import { getLocalDateKey } from "./dates";
import { Conversation, DailyCountData } from "./types";
import { ColumnDatum, YearData } from "@/components/heatmap/types";

// Get the number of messages sent each day
const getMsgCountForEachDay = (conversations: Conversation[]): {
	dailyCount: DailyCountData;
  years: Set<number>;
} => {
	const dailyCount: DailyCountData = {};
	const years = new Set<number>();

	conversations.forEach(conversation => {
		// Track conversation
		const { dateKey: convDateKey, year } = getLocalDateKey(conversation.created_at);
		if (!dailyCount[convDateKey]) {
      dailyCount[convDateKey] = {
        num_conversations_started: 0,
				num_messages: 0,
				num_messages_human: 0,
				input_tokens: 0,
        num_messages_assistant: 0,
				output_tokens: 0
			};
    }
		dailyCount[convDateKey].num_conversations_started++;
    years.add(year);

		// Track messages
    conversation.chat_messages.forEach(message => {
      const { dateKey: msgDateKey, year: msgYear } = getLocalDateKey(message.created_at);
      if (!dailyCount[msgDateKey]) {
        dailyCount[msgDateKey] = { 
          num_conversations_started: 0,
          num_messages: 0,
          num_messages_human: 0,
					input_tokens: 0,
          num_messages_assistant: 0,
					output_tokens: 0
				};
      }
      dailyCount[msgDateKey].num_messages++;
      if (message.sender === 'human') {
        dailyCount[msgDateKey].num_messages_human++;
				dailyCount[msgDateKey].input_tokens += get_token_count(message.text);
      } else if (message.sender === 'assistant') {
        dailyCount[msgDateKey].num_messages_assistant++;
				dailyCount[msgDateKey].output_tokens += get_token_count(message.text);
      }
			years.add(msgYear);
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
	// If start date is already a Sunday, we don't need to move backwards
	if (firstSunday.getDay() !== 0) {
		while (firstSunday.getDay() !== 0) {
			firstSunday.setDate(firstSunday.getDate() - 1);
		}
	}

	const weeks: ColumnDatum[] = [];
  const currentDate = new Date(firstSunday);
  let weekIndex = 0;
	// Iterate through every week and populate daily data
	while (currentDate <= endDate) {
    const bins = Array.from({ length: 7 }, (_, dayIndex) => {
      const binDate = new Date(currentDate);
      binDate.setDate(binDate.getDate() + dayIndex);
      
      const isEmpty = binDate < startDate || binDate > endDate;
      const { dateKey } = getLocalDateKey(binDate);
      
      return {
        date: binDate,
				day: dayIndex,
        isEmpty,
				num_conversations: isEmpty ? 0 : (dailyCount[dateKey]?.num_conversations_started || 0),
				num_messages: isEmpty ? 0 : (dailyCount[dateKey]?.num_messages || 0),
				num_messages_human: isEmpty ? 0 : (dailyCount[dateKey]?.num_messages_human || 0),
				input_tokens: isEmpty ? 0 : (dailyCount[dateKey]?.input_tokens || 0),
				num_messages_assistant: isEmpty ? 0 : (dailyCount[dateKey]?.num_messages_assistant || 0),
				output_tokens: isEmpty ? 0 : (dailyCount[dateKey]?.output_tokens || 0)
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
	endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 364); // rolling 365 days

	// For rolling year view, we need to calculate totals differently
  const getRollingYearTotals = () => {
    let total_messages = 0;
    let total_conversations = 0;
		let total_messages_human = 0;
		let input_tokens = 0;
		let total_messages_assistant = 0;
		let output_tokens = 0;
    Object.entries(dailyCount).forEach(([date, counts]) => {
      const currentDate = new Date(date);
      if (currentDate >= startDate && currentDate <= endDate) {
        total_messages += counts.num_messages;
        total_conversations += counts.num_conversations_started;
				total_messages_human += counts.num_messages_human;
				input_tokens += counts.input_tokens;
				total_messages_assistant += counts.num_messages_assistant;
				output_tokens += counts.output_tokens;
      }
    });
    return { 
			total_messages, total_conversations, 
			total_messages_human, input_tokens,
			total_messages_assistant, output_tokens
		};
  };

  // Calculate yearly totals
  const getYearTotals = (year: number) => {
    let total_messages = 0;
    let total_conversations = 0;
		let total_messages_human = 0;
		let input_tokens = 0;
		let total_messages_assistant = 0;
		let output_tokens = 0;
    Object.entries(dailyCount).forEach(([date, counts]) => {
      if (new Date(date).getFullYear() === year) {
        total_messages += counts.num_messages;
        total_conversations += counts.num_conversations_started;
				total_messages_human += counts.num_messages_human;
				input_tokens += counts.input_tokens;
				total_messages_assistant += counts.num_messages_assistant;
				output_tokens += counts.output_tokens;
      }
    });
    return { 
			total_messages, total_conversations, 
			total_messages_human, input_tokens,
			total_messages_assistant, output_tokens
		};
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