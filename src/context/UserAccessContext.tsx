import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";

interface UserAccessContextType {
  accessList: string[];
  hasAccess: (key: string) => boolean;
  isLoading: boolean;
}

const UserAccessContext = createContext<UserAccessContextType | undefined>(undefined);

export function UserAccessProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [accessList, setAccessList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setAccessList([]);
    setIsLoading(false);
  }, [isAuthenticated]);

  const hasAccess = (key: string): boolean => {
    return accessList.includes(key);
  };

  return (
    <UserAccessContext.Provider value={{ accessList, hasAccess, isLoading }}>
      {children}
    </UserAccessContext.Provider>
  );
}

export function useUserAccess() {
  const context = useContext(UserAccessContext);
  if (context === undefined) {
    throw new Error("useUserAccess must be used within a UserAccessProvider");
  }
  return context;
}