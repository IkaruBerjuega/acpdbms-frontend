import { LoginResponseInterface } from "@/lib/definitions";

export const useToken = () => {
  //store token function, stores the user data with token
  const storeToken = async (body: { token: string }) => {
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

  //get token function server side
  const getToken = async (): Promise<{ token: string } | null> => {
    try {
      const response = await fetch(`/api/auth/token`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Ensure cookies are included in the request
      });

      if (!response.ok) return null;

      const data: { token: string } = await response.json();
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

  return { storeToken, getToken, deleteToken };
};

export const useRole = () => {
  //store token function, stores the user data with token
  const storeRole = async (body: { role: string }) => {
    try {
      const response = await fetch(`/api/auth/role`, {
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

  //get token function server side
  const getRole = async (): Promise<{ role: string } | null> => {
    try {
      const response = await fetch(`/api/auth/role`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Ensure cookies are included in the request
      });

      if (!response.ok) return null;

      const data: { role: string } = await response.json();
      return data ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  //delete token function , will be called for signing out
  const deleteRole = async () => {
    try {
      const response = await fetch(`/api/auth/role`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return false;
      return true; //set isStored to true when the token is stored in http only cookie
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  return { storeRole, getRole, deleteRole };
};

export const useDeviceToken = () => {
  //store token function, stores the user data with token
  const storeDeviceToken = async (body: {
    device_token: string;
    email: string;
  }) => {
    try {
      const response = await fetch(`/api/auth/device-token`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) return false;
      return true; //set isStored to true when the token is stored in http only cookie
    } catch (error) {
      return error;
    }
  };

  //get token function server side
  const getDeviceToken = async ({
    email,
  }: {
    email: string;
  }): Promise<{ device_token: string } | null> => {
    try {
      const response = await fetch(`/api/auth/device-token?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Ensure cookies are included in the request
      });

      if (!response.ok) return null;

      const data: { device_token: string } = await response.json();
      return data ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  //delete token function , will be called for signing out
  const deleteDeviceToken = async () => {
    try {
      const response = await fetch(`/api/auth/device-token`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) return false;
      return true; //set isStored to true when the token is stored in http only cookie
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  return { storeDeviceToken, deleteDeviceToken, getDeviceToken };
};
