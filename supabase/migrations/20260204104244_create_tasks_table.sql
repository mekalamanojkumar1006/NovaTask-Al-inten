/*
  # NovaTask - Task Management System

  ## Overview
  Creates the core tasks table for the NovaTask application with full CRUD capabilities.

  ## New Tables
  
  ### `tasks`
  - `id` (uuid, primary key) - Unique identifier for each task
  - `title` (text, required) - Task title/name
  - `description` (text, optional) - Detailed task description
  - `status` (text, default: 'pending') - Task status: pending, in_progress, completed
  - `priority` (text, default: 'medium') - Task priority: low, medium, high, urgent
  - `due_date` (timestamptz, optional) - Task deadline
  - `created_at` (timestamptz) - Timestamp when task was created
  - `updated_at` (timestamptz) - Timestamp when task was last updated
  - `user_id` (uuid, optional) - Reference to auth.users for multi-user support

  ## Security
  - Enables Row Level Security (RLS) on tasks table
  - Public access policies for SELECT, INSERT, UPDATE, DELETE operations
  - In production, these should be restricted to authenticated users
  
  ## Indexes
  - Index on status for efficient filtering
  - Index on priority for sorting
  - Index on created_at for chronological ordering
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, restrict these to authenticated users only
CREATE POLICY "Allow public read access"
  ON tasks
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON tasks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON tasks
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON tasks
  FOR DELETE
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();