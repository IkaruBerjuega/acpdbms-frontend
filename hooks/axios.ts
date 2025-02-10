import axios from "axios";
import Cookies from "js-cookie";

export const axiosWithAuth = async (
  url: string,
  method: "get" | "post" | "put" | "patch" | "delete" = "get",
  data?: any,
  customHeaders?: Record<string, string> | null,
  contentType: string = "application/json",
  withAuth: boolean = true
) => {
  const token = Cookies.get("token");

  if (!token && withAuth) {
    return { data: null, error: "No authorization token found" };
  }

  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": contentType,
        ...(withAuth ? { Authorization: `Bearer ${token}` } : {}), // Correct conditional assignment
        ...customHeaders,
      },
      ...(withAuth ? { withCredentials: true } : { withCredentials: false }),
      data,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.email ||
      (error instanceof Error ? error.message : "Request failed");
    return { data: null, error: errorMessage };
  }
};

// export const axiosWithAuthWithoutToken = async (
//   url: string,
//   method: "get" | "post" | "put" | "patch" | "delete" = "get",
//   data?: any,
//   customHeaders?: Record<string, string> | null,
//   contentType: string = "application/json"
// ) => {
//   try {
//     const response = await axios({
//       url,
//       method,
//       headers: {
//         "Content-Type": contentType,
//         ...customHeaders,
//       },
//       withCredentials: true,
//       data,
//     });
//     return { data: response.data, error: null };
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Request failed";
//     console.error(errorMessage);
//     return { data: null, error: errorMessage };
//   }
// };
