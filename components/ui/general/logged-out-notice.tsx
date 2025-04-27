"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AutomaticallyLoggedOutNotice() {
  const { paramsKey } = useQueryParams();

  const isLoggedOut = paramsKey["isLoggedOut"] === "true";

  if (!isLoggedOut) return null;

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-black-primary/80 z-50 flex items-center justify-center">
      <div className="bg-white-primary rounded-md w-[90%] sm:w-[75%] lg:w-[50%] xl:w-[40%] p-8 flex flex-col items-center text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-3">Session Expired</h2>
        <p className="text-gray-600 mb-6">
          You have been logged out due to inactivity. For security reasons, we
          automatically log out users after a period of inactivity.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-black-primary text-white-primary hover:bg-black-secondary text-white font-medium rounded-md transition-colors"
        >
          Log In Again
        </Link>
      </div>
    </div>
  );
}
