import { Task } from '../types/task';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIAnalysisProps {
  tasks: Task[];
  onClose: () => void;
}

export default function AIAnalysis({ tasks, onClose }: AIAnalysisProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  const getProductivityInsight = () => {
    if (completionRate >= 80) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        message: 'Excellent productivity! You are completing most of your tasks.',
      };
    } else if (completionRate >= 50) {
      return {
        icon: TrendingUp,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        message: 'Good progress! Keep up the momentum to improve completion rate.',
      };
    } else {
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        message: 'Consider breaking down tasks into smaller, manageable pieces.',
      };
    }
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (urgentTasks > 0) {
      recommendations.push({
        title: 'Focus on Urgent Tasks',
        description: `You have ${urgentTasks} urgent ${urgentTasks === 1 ? 'task' : 'tasks'}. Prioritize ${urgentTasks === 1 ? 'it' : 'them'} to avoid delays.`,
        priority: 'high',
      });
    }

    if (overdueTasks > 0) {
      recommendations.push({
        title: 'Address Overdue Items',
        description: `${overdueTasks} ${overdueTasks === 1 ? 'task is' : 'tasks are'} overdue. Consider rescheduling or completing ${overdueTasks === 1 ? 'it' : 'them'} soon.`,
        priority: 'urgent',
      });
    }

    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    if (inProgressTasks > 5) {
      recommendations.push({
        title: 'Too Many Active Tasks',
        description: `You have ${inProgressTasks} tasks in progress. Focus on completing a few before starting new ones.`,
        priority: 'medium',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Well Organized',
        description: 'Your tasks are well managed. Keep maintaining this balance!',
        priority: 'low',
      });
    }

    return recommendations;
  };

  const insight = getProductivityInsight();
  const recommendations = getRecommendations();
  const InsightIcon = insight.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Task Analysis</h2>
                <p className="text-blue-100 text-sm">Powered by NovaTask Intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${insight.bg} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <InsightIcon className={`w-8 h-8 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Productivity Insight</h3>
                <p className="text-gray-700 mb-3">{insight.message}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className={`text-2xl font-bold ${insight.color}`}>{completionRate}%</p>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        rec.priority === 'urgent'
                          ? 'bg-red-500'
                          : rec.priority === 'high'
                          ? 'bg-orange-500'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-gray-600 text-sm">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-blue-600">{totalTasks - completedTasks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
