//Grant Access

import { z } from "zod";

export const grantProjectAccessSchema = z.object({
  project_id: z.string().min(1, "Project is required"), // Ensures project_id is not empty
  team: z
    .array(
      z.object({
        employee_id: z.string().min(1, "Project is required"), // Ensures it's a positive number
        role: z.enum(["Project Manager", "Member"], {
          errorMap: () => ({ message: "Invalid Role" }),
        }),
      })
    )
    .min(1, "At least one employee must be assigned"), // Ensures team is not empty
});
