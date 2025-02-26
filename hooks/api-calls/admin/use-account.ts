"use client";

import { useApiQuery } from "@/hooks/tanstack-query-hook";
import {
  ClientListResponseInterface,
  EmployeeInterface,
} from "@/lib/definitions";

export const useAccount = () => {
  /*API Calls*/

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
  const clientAccounts = useApiQuery<ClientListResponseInterface[]>({
    key: "clients",
    url: "/clients-list",
  });

  // Fetch archived client accounts
  const archivedClientAccounts = useApiQuery<ClientListResponseInterface[]>({
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
