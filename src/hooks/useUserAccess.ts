import { useUserAccess as useUserAccessContext } from "@/context/UserAccessContext";

export function useUserAccess() {
  return useUserAccessContext();
}
