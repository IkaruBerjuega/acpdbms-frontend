"use client";

import React, { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/api-calls/admin/use-dashboard";
import { Employee } from "@/lib/definitions";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EmployeeHours() {
  const {
    employeeWorkHours,
    empSelectedMonth,
    empSelectedYear,
    setEmpSelectedMonth,
    setEmpSelectedYear,
  } = useDashboard();

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!employeeWorkHours.isLoading && isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [employeeWorkHours.isLoading]);

  const showSkeleton = employeeWorkHours.isLoading && isFirstLoad.current;

  const employees: Employee[] = Array.isArray(employeeWorkHours.data)
    ? employeeWorkHours.data
    : [];

  return (
    <div className="h-[440px] flex flex-col bg-white-primary rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header with Title and Filters */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-primary">Employee Work Hours</p>
        {showSkeleton ? (
          <Skeleton className="bg-gray-300 w-[60px] h-[35px] rounded-md" />
        ) : (
          <div className="flex space-x-2">
            <select
              value={empSelectedMonth}
              onChange={(e) => setEmpSelectedMonth(e.target.value)}
              className="rounded border border-primary p-1 text-sm"
            >
              {monthNames.map((month, i) => {
                const value = (i + 1).toString();
                return (
                  <option key={value} value={value}>
                    {month}
                  </option>
                );
              })}
            </select>
            <select
              value={empSelectedYear}
              onChange={(e) => setEmpSelectedYear(e.target.value)}
              className="rounded border border-primary p-1 text-sm"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
            </select>
          </div>
        )}
      </div>

      {/* Employee Count */}
      {showSkeleton ? (
        <Skeleton className="bg-gray-300 h-[35px] w-32 rounded-md mb-2" />
      ) : (
        <div className="rounded-lg bg-white-primary h-[35px] flex items-center">
          <span className="text-gray-600 font-medium">
            {employees.length} Employees
          </span>
        </div>
      )}

      {/* Employee List */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 px-4 py-2 flex-grow border border-gray-200 rounded-md">
        {showSkeleton ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="bg-gray-300 h-12 rounded-md w-full mb-3"
            />
          ))
        ) : employees.length === 0 ? (
          <p className="w-full h-full flex justify-center items-center text-lg text-gray-500">
            No Data Available
          </p>
        ) : (
          <div className="flex flex-col w-full space-y-3">
            {employees.map((employee) => (
              <div
                key={employee.user_id}
                className="flex flex-col p-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-900">
                    {employee.full_name}
                  </p>
                  <p className="text-sm text-gray-600">{employee.hours} hrs</p>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-eerieblack h-4 rounded-full"
                    style={{
                      width: `${Math.min((employee.hours / 160) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
