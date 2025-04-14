'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';

export default function ProjectLocations() {
  const { projectLocations, selectedYear, setSelectedYear } = useDashboard();

  const isFirstLoad = useRef(true);

  const [selectedState, setSelectedState] = useState<string>('');

  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const themeColors = ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'];

  const chartData = projectLocations.data as any[] | undefined;

  const states = chartData
    ? Array.from(new Set(chartData.map((item) => item.state)))
    : [];

  useEffect(() => {
    if (states.length > 0 && !states.includes(selectedState)) {
      setSelectedState(states[0]);
    }
  }, [states, selectedState]);

  const filteredData = chartData
    ? chartData.filter((item) => item.state === selectedState)
    : [];

  const aggregatedData = filteredData.map((item, index) => ({
    name: item.city_town,
    value: Number(item.project_count),
    color: themeColors[index % themeColors.length],
  }));

  const totalDistinctPlaces = aggregatedData.length;

  useEffect(() => {
    if (!projectLocations.isLoading && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [projectLocations.isLoading]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setChartConfig({
        project_count: {
          label: 'Projects',
          color: themeColors[0],
        },
      });
    }
  }, [chartData]);

  const showSkeleton = projectLocations.isLoading && isFirstLoad.current;

  return (
    <Card className='max-h-[445px] border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white-primary'>
      <CardHeader>
        <div className='flex items-center justify-between w-full'>
          <CardTitle className='text-lg'>Project Locations</CardTitle>

          <div className='flex space-x-2'>
            {showSkeleton ? (
              <Skeleton className='bg-gray-300 w-[60px] h-[35px] rounded-md' />
            ) : (
              <>
                {/* only render the state dropdown when there are states */}
                {states.length > 0 && (
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className='rounded border border-primary p-1 text-sm'
                  >
                    {states.map((state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className='rounded border border-primary p-1 text-sm'
                >
                  <option value='2025'>2025</option>
                  <option value='2026'>2026</option>
                  <option value='2027'>2027</option>
                  <option value='2028'>2028</option>
                  <option value='2029'>2029</option>
                  <option value='2030'>2030</option>
                </select>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='flex justify-center items-center mt-6'>
        {showSkeleton ? (
          <Skeleton className='bg-gray-300 w-full h-[300px] rounded-md' />
        ) : projectLocations.error ||
          !chartData ||
          !Array.isArray(chartData) ||
          chartData.length === 0 ? (
          <div className='w-full h-[310px] flex justify-center items-center text-lg text-gray-500'>
            <p>No Data Available</p>
          </div>
        ) : (
          <ChartContainer
            className='h-[270px]'
            config={chartConfig}
          >
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <PieChart>
                <Pie
                  data={aggregatedData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                >
                  {aggregatedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <text
                  x='50%'
                  y='40%'
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={24}
                  fontWeight='bold'
                  fill='#333'
                >
                  {totalDistinctPlaces}
                </text>
                <text
                  x='50%'
                  y='40%'
                  dy='1.2em'
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={14}
                  fill='#666'
                >
                  Cities/Towns
                </text>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend content={<ChartLegendContent nameKey='name' />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
