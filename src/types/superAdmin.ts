export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "Broker" | "Admin" | "SuperAdmin" | "Assistant";
  status: "Active" | "Inactive";
  subscription: UserSubscription | null;
  moduleAccess?: string[];
  authMethod?: "email" | "mobile";
}

export interface UserSubscription {
  planId: string;
  plan: string;
  type: "Trial" | "Onboarding" | "Monthly" | "Yearly" | "Basic" | "Advanced";
  price: number;
  startDate: string;
  endDate: string;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  subscription: string;
}

export interface UserFormData {
  name: string;
  email: string;
  mobile: string;
  role: "Broker" | "Admin" | "SuperAdmin" | "Assistant";
}

export interface SubscriptionFormData {
  planId: string;
  startDate: string;
}

export interface NewUserFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: "Broker" | "Admin" | "Assistant";
  moduleAccess: string[];
}

export const AVAILABLE_MODULES = [
  "dashboard",
  "profiles_view",
  "profiles_add",
  "profiles_edit",
  "profiles_delete",
  "match_profiles",
  "verification",
  "reports",
  "settings",
  "user_management",
] as const;

export type ModuleAccess = typeof AVAILABLE_MODULES[number];