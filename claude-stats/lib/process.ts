import { Conversation, ConversationStats, DailyCount } from "./types"

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
    return dailyCounts;
  } catch (error) {
    console.error('Error processing conversations:', error);
    return {};
  }
}

export const calculateStats = (data: Conversation[]): ConversationStats => {
  try {
    if (!data || !Array.isArray(data)) {
      return {
        totalConversations: 0,
        totalMessages: 0,
        byYear: {}
      };
    }

    const stats: ConversationStats = {
      totalConversations: 0,
      totalMessages: 0,
      byYear: {}
    };

    data.forEach(conversation => {
      if (!conversation.chat_messages) {
        return;
      }
      
      stats.totalConversations++;
      const year = new Date(conversation.created_at).getFullYear();
      
      if (!stats.byYear[year]) {
        stats.byYear[year] = { conversations: 0, messages: 0 };
      }
      
      stats.byYear[year].conversations++;
      
      const messageCount = conversation.chat_messages.length;
      stats.totalMessages += messageCount;
      stats.byYear[year].messages += messageCount;
    });

    return stats;
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      totalConversations: 0,
      totalMessages: 0,
      byYear: {}
    };
  }
};