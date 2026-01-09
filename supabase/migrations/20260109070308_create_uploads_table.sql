/*
  # Create uploads tracking table

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key) - Unique identifier for each upload record
      - `file_name` (text) - Name of the uploaded file
      - `file_path` (text) - Original file path/identifier
      - `file_size` (bigint) - File size in bytes
      - `file_type` (text) - Type of file (image/video)
      - `mime_type` (text) - MIME type of the file
      - `upload_status` (text) - Status: 'pending', 'success', 'failed'
      - `facebook_post_id` (text, nullable) - Facebook post ID if successful
      - `description` (text, nullable) - Description used for the upload
      - `error_message` (text, nullable) - Error message if upload failed
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `uploads` table
    - Add policy for public access (since this is a tool for local use)
    
  3. Indexes
    - Index on file_path for quick duplicate checking
    - Index on upload_status for filtering
*/

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  mime_type text NOT NULL,
  upload_status text NOT NULL DEFAULT 'pending',
  facebook_post_id text,
  description text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to uploads"
  ON uploads FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to uploads"
  ON uploads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to uploads"
  ON uploads FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_uploads_file_path ON uploads(file_path);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(upload_status);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);