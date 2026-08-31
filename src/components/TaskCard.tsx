import { Task } from '../types/task';
import { Clock, Trash2, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  urgent: 'bg-red-100 text-red-800 border-red-300',
};

const statusIcons = {
  pending: Circle,
  in_progress: AlertCircle,
  completed: CheckCircle2,
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => {
                const nextStatus =
                  task.status === 'pending' ? 'in_progress' :
                  task.status === 'in_progress' ? 'completed' : 'pending';
                onStatusChange(task.id, nextStatus);
              }}
              className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <StatusIcon className={`w-6 h-6 ${task.status === 'completed' ? 'text-green-600' : ''}`} />
            </button>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                  {task.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {task.due_date && (
          <div className={`flex items-center gap-2 text-sm mt-4 pt-4 border-t border-gray-100 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-medium">
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDate(task.due_date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
