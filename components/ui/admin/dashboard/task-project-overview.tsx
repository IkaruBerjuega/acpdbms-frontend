'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import { ClipboardList, FolderOpen } from 'lucide-react';

interface Metrics {
  projectsInProgress: number;
  projectsCompleted: number;
  projectCompletionChange: number;
  tasksInProgress: number;
  tasksCompleted: number;
  taskCompletionChange: number;
}

interface ProjectMetricsData {
  projects_in_progress: number;
  projects_completed: number;
  project_completion_change: number;
}

interface TaskMetricsData {
  tasks_in_progress: number;
  tasks_completed: number;
  task_completion_change: number;
}

export default function TaskCards() {
  const { projectMetrics, taskMetrics } = useDashboard();

  const error = projectMetrics.error || taskMetrics.error;
  if (error) {
    return <p className='text-red-500'>{error.message}</p>;
  }

  // Show skeletons while loading.
  if (projectMetrics.isLoading || taskMetrics.isLoading) {
    return (
      <div className='flex-grow mt-2 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map((index) => (
          <Skeleton
            key={index}
            className='bg-darkgray-200 h-full w-full rounded-md'
          />
        ))}
      </div>
    );
  }

  // Cast the data to the expected types.
  const projectData = projectMetrics.data as ProjectMetricsData;
  const taskData = taskMetrics.data as TaskMetricsData;

  const metrics: Metrics = {
    projectsInProgress: projectData.projects_in_progress,
    projectsCompleted: projectData.projects_completed,
    projectCompletionChange: projectData.project_completion_change,
    tasksInProgress: taskData.tasks_in_progress,
    tasksCompleted: taskData.tasks_completed,
    taskCompletionChange: taskData.task_completion_change,
  };

  const metricsData = [
    {
      title: 'Projects in Progress',
      value: metrics.projectsInProgress,
      percent: metrics.projectCompletionChange,
      href: '/admin/projects?status=ongoing',
      helpText: 'for this year',
      icon: <FolderOpen className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Projects Completed',
      value: metrics.projectsCompleted,
      percent: metrics.projectCompletionChange,
      href: '/admin/projects?status=finished',
      helpText: 'for this year',
      icon: <FolderOpen className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Tasks in Progress',
      value: metrics.tasksInProgress,
      percent: metrics.taskCompletionChange,
      href: '/admin/projects/tasks?status=ongoing',
      helpText: 'for this week',
      icon: <ClipboardList className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Tasks Completed',
      value: metrics.tasksCompleted,
      percent: metrics.taskCompletionChange,
      href: '/admin/projects/tasks?status=finished',
      helpText: 'for this week',
      icon: <ClipboardList className='h-5 w-5 text-gray-500' />,
    },
  ];

  return (
    <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      {metricsData.map((item, index) => {
        const isPositive = item.percent >= 0;
        const sign = isPositive ? '+' : '-';
        const absPercent = Math.abs(item.percent);

        return (
          <a
            key={index}
            href={item.href}
            className='bg-white-primary rounded-lg border border-gray-300 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'
          >
            {/* Top row with title and icon */}
            <div className='flex items-center justify-between mb-2'>
              <p className='text-lg font-bold text-primary'>{item.title}</p>
              {item.icon}
            </div>

            {/* Main value */}
            <p className='text-[28px] sm:text-[32px] font-bold text-primary'>
              {item.value || '0'}
            </p>

            {/* Percent change and help text */}
            <p className='text-sm text-gray-500'>
              {item.percent !== 0 && (
                <span
                  className={isPositive ? 'text-green-600' : 'text-red-600'}
                >
                  {`${sign}${absPercent}% `}
                </span>
              )}
              {item.helpText}
            </p>
          </a>
        );
      })}
    </div>
  );
}
