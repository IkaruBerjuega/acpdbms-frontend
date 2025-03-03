import { useApiQuery } from "@/hooks/tanstack-query";
import { ClientInterface } from "@/lib/definitions";

export const useProject = () => {
  // Fetch client accounts
  const projectsList = useApiQuery<ClientInterface[]>({
    key: "projects",
    url: "/project-list",
  });

  return { projectsList };
};
