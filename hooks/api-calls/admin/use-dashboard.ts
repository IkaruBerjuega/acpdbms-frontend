'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TaskCountIntervalTypes } from '@/lib/definitions';
import { useApiQuery } from '@/hooks/tanstack-query';

export const useDashboard = () => {
  // Set disableFetching to true while you are fixing the UI.
  // When the backend is ready, set this flag to false.
  const disableFetching = true;

  const queryClient = useQueryClient();

  // Poll online-users every 60 seconds by refetching active queries with key "online-users"
  // Only run polling if fetching is enabled.
  useEffect(() => {
    if (!disableFetching) {
      const intervalId = setInterval(() => {
        queryClient.refetchQueries({
          queryKey: ['online-users'],
          active: true,
        });
      }, 60000); // 60 seconds
      return () => clearInterval(intervalId);
    }
  }, [queryClient, disableFetching]);

  // Static endpoints: these queries run on mount.
  // NOTE: Remove the initialData properties when your backend is ready.
  const onlineUsers = useApiQuery({
    key: 'online-users',
    url: '/dashboard/online-users',
    enabled: !disableFetching, // Disable fetching while UI is being fixed.
    initialData: [
      { profile: '', name: 'John Doe', role: 'Developer' },
      { profile: '', name: 'Jane Smith', role: 'Manager' },
    ], // <-- Placeholder data. Remove when backend is ready.
  });

  const ticketsWithDetails = useApiQuery({
    key: 'tickets-with-details',
    url: '/dashboard/tickets-with-details',
    enabled: !disableFetching,
    initialData: [
      {
        ticket_id: '1',
        user_name: 'Alice',
        content: 'Project update: Completed phase 1',
        date: '2025-03-19',
      },
      {
        ticket_id: '2',
        user_name: 'Bob',
        content: 'Project update: Starting phase 2',
        date: '2025-03-18',
      },
    ], // <-- Placeholder data. Remove when backend is ready.
  });

  const projectMetrics = useApiQuery({
    key: 'project-metrics',
    url: '/dashboard/project-metrics',
    enabled: !disableFetching,
    initialData: {
      projects_in_progress: 4,
      projects_completed: 6,
      project_completion_change: 8,
    }, // <-- Placeholder data. Remove when backend is ready.
  });

  const taskMetrics = useApiQuery({
    key: 'task-metrics',
    url: '/dashboard/task-metrics',
    enabled: !disableFetching,
    initialData: {
      tasks_in_progress: 10,
      tasks_completed: 20,
      task_completion_change: 15,
    }, // <-- Placeholder data. Remove when backend is ready.
  });

  const projectLocations = useApiQuery({
    key: 'project-locations',
    url: '/dashboard/project-locations',
    enabled: !disableFetching,
    initialData: [
      {
        year: '2025',
        'New York': 12,
        'Los Angeles': 8,
        Chicago: 5,
        Houston: 10,
        Phoenix: 7,
      },
      {
        year: '2026',
        'New York': 14,
        'Los Angeles': 6,
        Chicago: 7,
        Houston: 12,
        Phoenix: 9,
      },
      {
        year: '2027',
        'New York': 10,
        'Los Angeles': 10,
        Chicago: 4,
        Houston: 9,
        Phoenix: 8,
      },
      {
        year: '2028',
        'New York': 16,
        'Los Angeles': 9,
        Chicago: 6,
        Houston: 11,
        Phoenix: 10,
      },
      {
        year: '2029',
        'New York': 18,
        'Los Angeles': 7,
        Chicago: 8,
        Houston: 13,
        Phoenix: 12,
      },
    ], // <-- Placeholder data. Remove when backend is ready.
  });

  // Endpoints that require an interval parameter:
  // They are disabled until the interval is set.
  const [analyticsInterval, setAnalyticsInterval] = useState<string | null>(
    null
  );
  const projectAnalytics = useApiQuery({
    key: analyticsInterval
      ? `project-analytics-${analyticsInterval}`
      : 'project-analytics',
    url: analyticsInterval
      ? `/dashboard/project-analytics/${analyticsInterval}`
      : '',
    enabled: !disableFetching && !!analyticsInterval,
  });

  const [userCountInterval, setUserCountInterval] = useState<string | null>(
    null
  );
  const userCounts = useApiQuery({
    key: userCountInterval ? `user-counts-${userCountInterval}` : 'user-counts',
    url: userCountInterval ? `/dashboard/user-counts/${userCountInterval}` : '',
    enabled: !disableFetching && !!userCountInterval,
  });

  const [taskCountInterval, setTaskCountInterval] =
    useState<TaskCountIntervalTypes | null>(null);
  const taskCounts = useApiQuery({
    key: taskCountInterval ? `task-counts-${taskCountInterval}` : 'task-counts',
    url: taskCountInterval ? `/dashboard/task-counts/${taskCountInterval}` : '',
    enabled: !disableFetching && !!taskCountInterval,
    initialData: [
      // Placeholder data for taskCounts. Replace these values with your sample structure.
      { period: 'Jan', ongoing_tasks: 10, completed_tasks: 5 },
      { period: 'Feb', ongoing_tasks: 12, completed_tasks: 7 },
      { period: 'Mar', ongoing_tasks: 8, completed_tasks: 9 },
    ],
  });

  return {
    onlineUsers, // { data, isLoading, isPending, error }
    ticketsWithDetails, // { data, isLoading, isPending, error }
    projectAnalytics, // Enabled when analyticsInterval is set
    setAnalyticsInterval, // Function to update analytics interval and trigger query
    projectMetrics, // { data, isLoading, isPending, error }
    taskMetrics, // { data, isLoading, isPending, error }
    userCounts, // Enabled when userCountInterval is set
    setUserCountInterval, // Function to update user count interval
    projectLocations, // { data, isLoading, isPending, error }
    taskCounts, // Enabled when taskCountInterval is set
    setTaskCountInterval, // Function to update task count interval
  };
};
