export interface Source {
  id: string;
  notebook_id: string;
  title: string;
  type: string;
  content: string | null;
  summary: string | null;
  url: string | null;
  processing_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notebook {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  notebook_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
