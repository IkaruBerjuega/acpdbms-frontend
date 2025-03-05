import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToken } from "../api-calls/use-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch Project Details
export const useFetchProjectDetails = (id: string) => {
  const { getToken } = useToken();

  return useQuery({
    queryKey: [`projectDetails-${id}`, id], // Cache key for React Query, Cache each project, utilize id for query key
    queryFn: async () => {
      const userData = await getToken();
      const response = await fetch(`${API_URL}/projects/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch project details");
      return response.json();
    },
    enabled: !!id, // Only fetch if `id` exists
  });
};

// Update Project Details
export const useUpdateProjectDetails = (id: string) => {
  const { getToken } = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const userData = await getToken();
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          ...(data ?? {}),
        }),
      });

      if (!response.ok) throw new Error("Failed to update project");

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectDetails", id] }); // Refresh project data
    },
  });
};
