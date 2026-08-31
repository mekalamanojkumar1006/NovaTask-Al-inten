import { API_URL } from '../lib/supabase';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    return response.json();
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },
};
