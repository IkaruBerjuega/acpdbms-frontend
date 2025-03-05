import { LoginResponseInterface } from "@/lib/definitions";

export const useToken = () => {
  //store token function, stores the user data with token
  const storeTokenWithUserData = async (body: LoginResponseInterface) => {
    try {
      const response = await fetch(`/api/auth/token`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return false;
      return true; //set isStored to true when the token is stored in http only cookie
    } catch (error) {
      return error;
    }
  };

  //get token function
  const getToken = async (): Promise<LoginResponseInterface | null> => {
    try {
      const response = await fetch(`/api/auth/token`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Ensure cookies are included in the request
      });

      if (!response.ok) return null;

      const data: LoginResponseInterface = await response.json();
      return data ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  //delete token function , will be called for signing out
  const deleteToken = async () => {
    try {
      const response = await fetch(`/api/auth/token`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return false;
      return true; //set isStored to true when the token is stored in http only cookie
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  return { storeTokenWithUserData, getToken, deleteToken };
};
