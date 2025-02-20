"use client";

import { useAccount } from "@/hooks/external-api/admin/use-account";

export default function Page() {
  const { employeeAccounts } = useAccount();

  const { data } = employeeAccounts;

  return (
    <h2 className="mb-2 text-lg font-semibold">
      Welcome to the Accounts
      {data?.map((account, index) => {
        return <div key={index}>{account.email}</div>;
      })}
    </h2>
  );
}
