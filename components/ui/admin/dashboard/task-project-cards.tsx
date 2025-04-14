'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import {
  Metrics,
  ProjectMetricsData,
  TaskMetricsData,
} from '@/lib/definitions';
import { ClipboardList, FolderOpen } from 'lucide-react';

export default function TaskCards() {
  const { projectStats, taskStats } = useDashboard();

  const error = projectStats.error || taskStats.error;

  //skeleton
  if (projectStats.isLoading || taskStats.isLoading) {
    return (
      <div className='h-[154px] flex-grow mt-2 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4'>
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className='bg-white-primary rounded-lg border border-gray-300 p-6 flex flex-col justify-between shadow-sm transition-shadow'
          >
            <div className='flex items-center justify-between mb-2'>
              <Skeleton className='bg-gray-300 h-6 w-32' />
              <Skeleton className='bg-gray-300 h-5 w-5' />
            </div>
            <Skeleton className='bg-gray-300 h-8 w-full' />
            <Skeleton className='bg-gray-300 h-4 w-1/2 mt-2' />
          </div>
        ))}
      </div>
    );
  }

  const projectData = (projectStats.data as ProjectMetricsData) || {};
  const taskData = (taskStats.data as TaskMetricsData) || {};

  const metrics: Metrics = {
    projectsInProgress: projectData.ongoing_projects ?? 0,
    projectsCompleted: projectData.finished_projects ?? 0,
    tasksInProgress: taskData.in_progress_tasks ?? 0,
    tasksNeedsReview: taskData.needs_review_tasks ?? 0,
    tasksCompleted: taskData.done_tasks ?? 0,
  };

  const metricsData = [
    {
      title: 'Projects in Progress',
      value: metrics.projectsInProgress,
      href: '/admin/projects?status=ongoing',
      helpText: 'as of today',
      icon: <FolderOpen className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Projects Completed',
      value: metrics.projectsCompleted,
      href: '/admin/projects?status=finished',
      helpText: 'as of this year',
      icon: <FolderOpen className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Tasks in Progress',
      value: metrics.tasksInProgress,
      href: '/admin/projects/tasks?status=ongoing',
      helpText: 'as of today',
      icon: <ClipboardList className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Tasks Pending Review',
      value: metrics.tasksNeedsReview,
      href: '/admin/projects/tasks?status=needs_review',
      helpText: 'as of today',
      icon: <ClipboardList className='h-5 w-5 text-gray-500' />,
    },
    {
      title: 'Tasks Completed',
      value: metrics.tasksCompleted,
      href: '/admin/projects/tasks?status=finished',
      helpText: 'as of today',
      icon: <ClipboardList className='h-5 w-5 text-gray-500' />,
    },
  ];

  return (
    <>
      {error && (
        <div className='text-red-500 text-sm mb-4'>
          Could not load some data. Displaying available metrics.
        </div>
      )}
      <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4'>
        {metricsData.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className='bg-white-primary rounded-lg border border-gray-300 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex items-center justify-between mb-2'>
              <p className='text-lg font-bold text-primary'>{item.title}</p>
              {item.icon}
            </div>
            <p className='text-[28px] sm:text-[32px] font-bold text-primary'>
              {item.value}
            </p>
            <p className='text-sm text-gray-500'>{item.helpText}</p>
          </a>
        ))}
      </div>
    </>
  );
}
