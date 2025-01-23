export interface Message {
  uuid: string;
  sender: string;
  text: string;
  content: Array<{type: string, text: string}>;
  created_at: string;
  updated_at: string;
  attachments: any[];
  files: any[];
}

export interface Conversation {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  account: {
    uuid: string;
  };
  chat_messages: Message[];
}

export interface DailyCount {
  [date: string]: number;
}

export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  byYear: {
    [year: number]: {
      conversations: number;
      messages: number;
    }
  };
}