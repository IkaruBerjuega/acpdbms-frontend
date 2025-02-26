import { useApiQuery } from "@/hooks/tanstack-query-hook";
import { ClientInterface } from "@/lib/definitions";

export const useProject = () => {
  // Fetch client accounts
  const projectsList = useApiQuery<ClientInterface[]>({
    key: "projects",
    url: "/project-list",
  });

  return { projectsList };
};
