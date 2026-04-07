import { SubscriptionPlan, UserProfile } from "@/types/settings";

export const MOCK_USER_PROFILE: UserProfile = {
  id: "user_1",
  name: "Ravi Kumar",
  email: "ravi@shubhmilan.com",
  mobile: "+91 9876543210",
  role: "Broker",
  subscription: {
    plan: "Free Trial",
    planId: "free",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    isActive: true,
  },
};

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Trial",
    duration: "30 days",
    type: "Trial",
    price: 0,
    features: ["Basic profile management", "Limited matches", "Email support"],
  },
  {
    id: "filter_monthly",
    name: "Match Filter Plan",
    duration: "Monthly",
    type: "Onboarding",
    price: 999,
    features: ["Advanced filtering", "Unlimited matches", "Priority support"],
  },
  {
    id: "premium_basic",
    name: "Premium Subscription (Basic)",
    duration: "Yearly",
    type: "Basic",
    price: 2999,
    features: ["All filter features", "Analytics dashboard", "Dedicated support", "API access"],
  },
  {
    id: "premium_filter",
    name: "Premium Subscription (With Filter)",
    duration: "Yearly",
    type: "Advanced",
    price: 3999,
    features: ["All premium features", "Advanced AI matching", "White-label options", "24/7 support"],
  },
];
