export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      notebooks: {
        Row: {
          audio_overview_generation_status: string | null
          audio_overview_url: string | null
          audio_url_expires_at: string | null
          color: string | null
          created_at: string
          description: string | null
          example_questions: string[] | null
          generation_status: string | null
          icon: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_overview_generation_status?: string | null
          audio_overview_url?: string | null
          audio_url_expires_at?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          example_questions?: string[] | null
          generation_status?: string | null
          icon?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_overview_generation_status?: string | null
          audio_overview_url?: string | null
          audio_url_expires_at?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          example_questions?: string[] | null
          generation_status?: string | null
          icon?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
      }
      sources: {
        Row: {
          content: string | null
          created_at: string
          display_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          notebook_id: string
          processing_status: string | null
          summary: string | null
          title: string
          type: Database["public"]["Enums"]["source_type"]
          updated_at: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          notebook_id: string
          processing_status?: string | null
          summary?: string | null
          title: string
          type: Database["public"]["Enums"]["source_type"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          notebook_id?: string
          processing_status?: string | null
          summary?: string | null
          title?: string
          type?: Database["public"]["Enums"]["source_type"]
          updated_at?: string
          url?: string | null
        }
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      source_type: "pdf" | "text" | "website" | "youtube" | "audio"
    }
  }
}

// Helper types
export type Notebook = Database['public']['Tables']['notebooks']['Row']
export type Source = Database['public']['Tables']['sources']['Row']
export type ChatHistory = Database['public']['Tables']['n8n_chat_histories']['Row']
