export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
}

export interface ChatRequest {
  session_id: string;
  table: string;
  message: string;
}

export interface TableOption {
  value: string;
  label: string;
}
