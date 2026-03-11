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

export interface ChatRequest {
  question: string;
  session_id: string;
  company_id: string;
  subject: string;
}
