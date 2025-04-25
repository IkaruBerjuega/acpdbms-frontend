"use client";

import { useApiMutation, useApiQuery } from "@/hooks/tanstack-query";
import { UserBasicInfo } from "@/lib/definitions";
import {
  ResetPasswordRequestByUser,
  ValidateTokenRequest,
} from "@/lib/user-definitions";

export const useAccounts = <T>({
  role,
  isArchived,
  initialData,
}: {
  role?: "employee" | "client";
  isArchived?: boolean;
  initialData?: T[];
}) => {
  const employeesQuery = useApiQuery<T[]>({
    key: !isArchived ? "employees" : "employees-archived",
    url: !isArchived ? "/employees-list" : "/employees-archived",
    initialData: initialData,
  });

  const clientsQuery = useApiQuery<T[]>({
    key: !isArchived ? "clients" : "clients-archived",
    url: !isArchived ? "/clients-list" : "/clients-archived",
    initialData: initialData,
  });

  // Select the correct query based on role
  const data = role === "employee" ? employeesQuery : clientsQuery;

  return {
    ...data,
  };
};

export const useUserBasicInfo = () => {
  return useApiQuery<UserBasicInfo>({
    key: "user-basic-info",
    url: "/user/basic-info",
  });
};

export const useUniquePositions = () => {
  return useApiQuery<string[]>({
    key: "unique-positions",
    url: "/unique-positions",
  });
};

export const useAccountActions = <T>() => {
  const deactivateAcc = useApiMutation<T>({
    url: "/users/deactivate",
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });

  const archiveAcc = useApiMutation<T>({
    url: "/users/archive",
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });

  const activateAcc = useApiMutation<T>({
    url: "/users/activate",
    method: "PATCH",
    contentType: "application/json",
    auth: true,
  });

  //client add
  const addClient = useApiMutation<T>({
    url: "/clients",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  //employee add
  const addEmployee = useApiMutation<T>({
    url: "/employees",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const sendReset = useApiMutation<T>({
    url: "/password-reset/send-link",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });

  const verifyToken = useApiMutation<ValidateTokenRequest>({
    url: "/password-reset/verify-token",
    method: "POST",
    contentType: "application/json",
    auth: true,
  });

  const resetPassword = useApiMutation<ResetPasswordRequestByUser>({
    url: "/password-reset/reset",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });

  return {
    sendReset,
    deactivateAcc,
    archiveAcc,
    activateAcc,
    addClient,
    addEmployee,
    verifyToken,
    resetPassword,
  };
};
