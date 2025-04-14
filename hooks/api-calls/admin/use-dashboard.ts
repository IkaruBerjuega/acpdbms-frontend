"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TaskCountIntervalTypes } from "@/lib/definitions";
import { useApiQuery } from "@/hooks/tanstack-query";

export const useDashboard = () => {
  const disableFetching = true;
  const queryClient = useQueryClient();

  // Auto refetch online users every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: ["online-users"],
        active: true,
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [queryClient]);

  // fetch online users
  const onlineUsers = useApiQuery({
    key: "online-users",
    url: "/dashboard/online-users",
    auth: true,
  });

  // fetch project statistics
  const projectStats = useApiQuery({
    key: "projectstats",
    url: "/dashboard/statistics",
    auth: true,
  });

  // fetch task statistics
  const taskStats = useApiQuery({
    key: "taskstats",
    url: "/dashboard/task-statistics",
    auth: true,
  });

  const [taskCountInterval, setTaskCountInterval] =
    useState<TaskCountIntervalTypes>("12_months");
  // fetch task stats for graph
  const taskCounts = useApiQuery({
    key: `task-stats-graph-${taskCountInterval}`,
    url: `/dashboard/task-statistics/graph?period=${taskCountInterval}`,
    auth: true,
    initialData: [],
  });

  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );

  // fetch project locations based on selectedYear
  const projectLocations = useApiQuery({
    key: ["project-locations", selectedYear],
    url: `/project-locations?year=${selectedYear}`,
    auth: true,
    initialData: [],
  });

  const [empSelectedMonth, setEmpSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );
  const [empSelectedYear, setEmpSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  //fetch employee performance meassured by hours
  const employeeWorkHours = useApiQuery({
    key: ["employee-work-hours", empSelectedMonth, empSelectedYear],
    url: `/dashboard/work-hours?month=${empSelectedMonth}&year=${empSelectedYear}`,
    auth: true,
    initialData: [],
  });

  const ticketsWithDetails = useApiQuery({
    key: "tickets-with-details",
    url: "/dashboard/tickets-with-details",
    auth: true,
    initialData: [],
  });

  return {
    onlineUsers,
    ticketsWithDetails,
    projectStats,
    taskStats,
    projectLocations,
    taskCounts,
    setTaskCountInterval,
    selectedYear,
    setSelectedYear,
    employeeWorkHours,
    empSelectedMonth,
    empSelectedYear,
    setEmpSelectedMonth,
    setEmpSelectedYear,
  };
};
