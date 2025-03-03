"use client";

import { useProject } from "@/hooks/api-calls/general/use-project";

export default function Page() {
  const { projectsList } = useProject();
  console.log(projectsList);

  return <div></div>;
}
