'use client';
import { useEffect, useState } from 'react';
import { TaskCountByInterval, TaskCountIntervalTypes } from '@/lib/definitions';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';

const chartConfig = {
  ongoing_tasks: {
    label: 'Ongoing',
    color: '#990000',
  },
  completed_tasks: {
    label: 'Completed',
    color: '#000000',
  },
} satisfies ChartConfig;

export default function TaskCountLineGraph() {
  const { taskCounts, setTaskCountInterval } = useDashboard();
  const [selectedInterval, setSelectedInterval] =
    useState<TaskCountIntervalTypes>('monthly');
  const intervalTypes: TaskCountIntervalTypes[] = [
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  // Update the task count interval in the hook when selectedInterval changes.
  useEffect(() => {
    setTaskCountInterval(selectedInterval);
  }, [selectedInterval, setTaskCountInterval]);

  return (
    <div className='flex flex-col justify-between bg-white-primary border border-gray-300 rounded-xl h-[500px] shadow-sm hover:shadow-md transition-shadow p-4'>
      {/* Header with title and interval buttons */}
      <div className='flex flex-row justify-between p-2.5'>
        <h1 className='text-xl font-semibold'>Tasks Overview</h1>
        <div className='flex flex-row'>
          {intervalTypes.map((interval) => (
            <button
              key={interval}
              className={`border-[1px] w-[65px] border-primary text-center text-xs ${
                selectedInterval === interval
                  ? 'bg-primary text-white-primary'
                  : ''
              }`}
              onClick={() => setSelectedInterval(interval)}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>
      {/* Conditional rendering for the main content */}
      {taskCounts.isLoading ? (
        <div className='flex h-[90%] w-full'>
          <Skeleton className='bg-gray-400 h-full w-full rounded-md' />
        </div>
      ) : !taskCounts.data ||
        !Array.isArray(taskCounts.data) ||
        taskCounts.data.length === 0 ? (
        <div className='flex h-[90%] w-full'>
          <div className='h-full w-full flex justify-center items-center border-[1px] rounded-md'>
            No data to show..
          </div>
        </div>
      ) : (
        <div className='flex h-[90%] w-full bg-white-primary'>
          <Card className='flex-1 border-none'>
            <CardHeader className='hidden'>
              <CardTitle>Line Chart - Multiple</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className='h-full w-full border-none'>
              <ChartContainer
                config={chartConfig}
                className='h-full w-full'
              >
                <LineChart
                  accessibilityLayer
                  data={taskCounts.data as TaskCountByInterval[]}
                  className='h-full w-full'
                  margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='period'
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey='ongoing_tasks'
                    type='monotone'
                    stroke='var(--color-ongoing_tasks)'
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    dataKey='completed_tasks'
                    type='monotone'
                    stroke='var(--color-completed_tasks)'
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>{/* Show more data here */}</CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
