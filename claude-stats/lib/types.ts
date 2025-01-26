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
  num_conversations_started: number;
  num_messages: number;
  num_messages_human: number;
  input_tokens: number;
  num_messages_assistant: number;
  output_tokens: number;
}
export interface DailyCountData {
  [date: string]: DailyCount;
}