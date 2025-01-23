import { Conversation, DailyCount } from "./types"

export const processConversations = (data: Conversation[]): DailyCount => {
  try {
    if (!data || !Array.isArray(data)) {
      console.log('Data received:', data);
      return {};
    }

    const dailyCounts: DailyCount = {};

    data.forEach(conversation => {
      if (!conversation.chat_messages) {
        console.log('Invalid conversation:', conversation);
        return;
      }

      conversation.chat_messages.forEach(message => {
        const date = new Date(message.created_at);
        const dateKey = date.toISOString().split('T')[0];
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      });
    });

    console.log('Daily counts:', dailyCounts);
    return dailyCounts;
  } catch (error) {
    console.error('Error processing conversations:', error);
    return {};
  }
}