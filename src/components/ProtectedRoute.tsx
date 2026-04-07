import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  accessKey?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
