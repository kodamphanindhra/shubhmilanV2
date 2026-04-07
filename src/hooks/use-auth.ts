import { useCallback, useState, useEffect } from "react";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Optionally, fetch user info from API here
      setUser({});
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (token: string, userInfo?: any) => {
    localStorage.setItem("auth_token", token);
    setUser(userInfo || {});
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}