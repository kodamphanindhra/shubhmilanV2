export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  type: "Trial" | "Onboarding" | "Basic" | "Advanced";
  price: number;
  features?: string[];
}

export interface UserSubscription {
  plan: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role?: string;
  subscription?: UserSubscription;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
