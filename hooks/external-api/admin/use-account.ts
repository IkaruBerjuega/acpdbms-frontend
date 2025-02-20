"use client";

import { useApiQuery } from "@/hooks/tanstack-query-hook";

export const useAccount = () => {
  // Fetch all employee accounts
  const employeeAccounts = useApiQuery<EmployeeInterface[]>({
    key: "employees",
    url: "/employees-list",
  });

  // Fetch all archived employee accounts
  const archivedEmployeeAccounts = useApiQuery<EmployeeInterface[]>({
    key: "employees-archived",
    url: "/employees-archived",
  });

  // Fetch client accounts
  const clientAccounts = useApiQuery<ClientInterface[]>({
    key: "clients",
    url: "/clients-list",
  });

  // Fetch archived client accounts
  const archivedClientAccounts = useApiQuery<ClientInterface[]>({
    key: "clients-archived",
    url: "/clients-archived",
  });

  return {
    employeeAccounts,
    archivedEmployeeAccounts,
    clientAccounts,
    archivedClientAccounts,
  };
};
