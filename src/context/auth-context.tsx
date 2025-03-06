"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AuthService from "@/services/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string | null;
  fullName: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  adminName: null,
  fullName: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authenticated = AuthService.isAuthenticated();
    if (!authenticated && pathname !== "/sign-in") {
      router.push("/sign-in");
    }
  }, [pathname]);

  const checkAuthStatus = () => {
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setAdminName(AuthService.getAdminName());
    setFullName(AuthService.getFullName());
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const publicPaths = ["/sign-in"];
    if (publicPaths.includes(pathname)) return;

    if (!loading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, loading, pathname, router]);

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setAdminName(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, adminName, fullName, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
