import Cookies from "js-cookie";
import axiosClient from "@/api-client/api-client";

/**
 * Auth service to manage authentication state
 */
export const AuthService = {
  /**
   * Login user with username and password
   */
  async login(adminName: string, password: string) {
    try {
      const response: any = await axiosClient.post("/admin/login", {
        adminName,
        password,
      });

      // Set cookies
      Cookies.set("token", response.token, { expires: 1 });
      Cookies.set("adminName", response.adminName, { expires: 1 });
      Cookies.set("fullName", response.fullName, { expires: 1 });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Check if the user is logged in
   */
  isAuthenticated(): boolean {
    const token = Cookies.get("token");
    return !!token;
  },

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    return Cookies.get("token") || null;
  },

  /**
   * Get the admin name
   */
  getAdminName(): string | null {
    return Cookies.get("adminName") || null;
  },

  getFullName(): string | null {
    return Cookies.get("fullName") || null;
  },

  /**
   * Log the user out
   */
  async logout() {
    try {
      // Call logout API if you have one
      // await axiosClient.post('/auth/logout');

      // Remove cookies
      Cookies.remove("token");
      Cookies.remove("adminName");
      Cookies.remove("fullName");

      // Redirect to login page
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove cookies even if API call fails
      Cookies.remove("token");
      Cookies.remove("adminName");
      Cookies.remove("fullName");
      window.location.href = "/sign-in";
    }
  },
};

export default AuthService;
