'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';
import { TaskCountIntervalTypes } from '@/lib/definitions';
import { Skeleton } from '../../skeleton';

const chartConfig: ChartConfig = {
  in_progress: {
    label: 'In Progress',
    color: '#34495E',
  },
  needs_review: {
    label: 'Needs Review',
    color: '#E67E22',
  },
  done: {
    label: 'Done',
    color: '#74B3A9',
  },
};

const intervalLabels: Record<TaskCountIntervalTypes, string> = {
  '7_days': 'Daily',
  '4_weeks': 'Weekly',
  '12_months': 'Monthly',
  '3_years': 'Yearly',
};

interface TaskCountData {
  period: string;
  in_progress: number;
  needs_review: number;
  done: number;
}

export default function TaskCountAreaChart() {
  const { taskCounts, setTaskCountInterval } = useDashboard();

  const isFirstLoad = useRef(true);

  const intervals: TaskCountIntervalTypes[] = [
    '7_days',
    '4_weeks',
    '12_months',
    '3_years',
  ];
  const [selectedInterval, setSelectedInterval] =
    useState<TaskCountIntervalTypes>('12_months');

  useEffect(() => {
    if (!taskCounts.isLoading && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [taskCounts.isLoading]);

  useEffect(() => {
    setTaskCountInterval(selectedInterval);
  }, [selectedInterval, setTaskCountInterval]);

  const data: TaskCountData[] = (taskCounts.data as TaskCountData[]) || [];

  const showSkeleton = taskCounts.isLoading && isFirstLoad.current;

  return (
    <Card className='w-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white-primary'>
      <CardHeader>
        <div className='flex items-center justify-between w-full'>
          <CardTitle className='text-lg font-bold'>Tasks Overview</CardTitle>

          {showSkeleton ? (
            <div className='flex space-x-2'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className='bg-gray-300 w-20 h-8 rounded-md'
                />
              ))}
            </div>
          ) : (
            <div className='space-x-1'>
              {intervals.map((interval) => (
                <button
                  key={interval}
                  onClick={() => setSelectedInterval(interval)}
                  className={`px-3 py-1 border rounded text-sm transition-colors ${
                    selectedInterval === interval
                      ? 'bg-primary text-white-primary border-transparent'
                      : 'border-primary text-primary hover:bg-primary hover:text-white-primary'
                  }`}
                >
                  {intervalLabels[interval]}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {showSkeleton ? (
          <Skeleton className='bg-gray-300 w-full h-[310px] rounded-md' />
        ) : data.length === 0 ? (
          <div className='flex h-[310px] w-full items-center justify-center text-gray-500 text-lg'>
            <p>No Data Available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[310px] w-full'
          >
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
              >
                <CartesianGrid
                  vertical={false}
                  horizontal={false}
                />
                <XAxis
                  dataKey='period'
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator='dot' />}
                />
                <Area
                  dataKey='in_progress'
                  type='natural'
                  fill={chartConfig.in_progress.color}
                  fillOpacity={0.4}
                  stroke={chartConfig.in_progress.color}
                  stackId='a'
                />
                <Area
                  dataKey='needs_review'
                  type='natural'
                  fill={chartConfig.needs_review.color}
                  fillOpacity={0.4}
                  stroke={chartConfig.needs_review.color}
                  stackId='a'
                />
                <Area
                  dataKey='done'
                  type='natural'
                  fill={chartConfig.done.color}
                  fillOpacity={0.4}
                  stroke={chartConfig.done.color}
                  stackId='a'
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
