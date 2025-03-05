import { ContactFormSchemaType } from "@/lib/form-constants/form-constants";
import { useApiMutation } from "../tanstack-query";

export const useSendContactForm = () => {
  return useApiMutation<ContactFormSchemaType>({
    url: "/contact",
    method: "POST",
    contentType: "application/json",
    auth: false,
  });
};
