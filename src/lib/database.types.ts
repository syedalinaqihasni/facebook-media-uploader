export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      uploads: {
        Row: {
          id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          file_type: string;
          mime_type: string;
          upload_status: 'pending' | 'success' | 'failed';
          facebook_post_id: string | null;
          description: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_path: string;
          file_size: number;
          file_type: string;
          mime_type: string;
          upload_status?: 'pending' | 'success' | 'failed';
          facebook_post_id?: string | null;
          description?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          file_type?: string;
          mime_type?: string;
          upload_status?: 'pending' | 'success' | 'failed';
          facebook_post_id?: string | null;
          description?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
