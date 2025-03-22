'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/api-calls/admin/use-dashboard';

const BarGraph = () => {
  // Use the projectLocations query from the dashboard hook
  const { projectLocations } = useDashboard();
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  // Cast the data from projectLocations to an array (if available)
  const chartData = projectLocations.data as any[] | undefined;

  // Update chartConfig dynamically when chartData is available
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const availableFields = chartData.flatMap((item) =>
        Object.keys(item).filter((key) => key !== 'year')
      );

      const dynamicChartConfig: ChartConfig = availableFields.reduce(
        (config, field, index) => {
          config[field] = {
            label: field.charAt(0).toUpperCase() + field.slice(1),
            color: [
              'hsl(12, 76%, 61%)',
              'hsl(173, 58%, 39%)',
              'hsl(197, 37%, 24%)',
              'hsl(43, 74%, 66%)',
              'hsl(27, 87%, 67%)',
            ][index % 5],
          };
          return config;
        },
        {} as ChartConfig
      );
      setChartConfig(dynamicChartConfig);
    }
  }, [chartData]);

  // Error handling using the query's error property
  if (projectLocations.error) {
    return <div>{projectLocations.error.message}</div>;
  }
  // Loading state from React Query
  if (projectLocations.isLoading) {
    return <Skeleton className='bg-darkgray-200 w-full h-full rounded-md' />;
  }
  // Fallback if no valid data is available
  if (!chartData || !Array.isArray(chartData)) {
    return <div>No data available</div>;
  }

  return (
    <ChartContainer
      className='w-full h-full'
      config={chartConfig}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='year'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.entries(chartConfig).map(([key, config], index) => (
          <Bar
            key={index}
            dataKey={key}
            stackId='a'
            fill={config.color}
            width={10}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default BarGraph;
