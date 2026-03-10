export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  session_id: string;
}
