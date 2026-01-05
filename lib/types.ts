export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}
