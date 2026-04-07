import { SuperAdminUser } from "@/types/superAdmin";

export const MOCK_SUPER_ADMIN_USERS: SuperAdminUser[] = [
  {
    "id": "user_1",
    "name": "Phanindhra",
    "email": "phanindhra@shubhmilan.com",
    "mobile": "+91 9000000001",
    "role": "Admin",
    "status": "Active",
    "subscription": {
      "planId": "premium",
      "plan": "Premium",
      "type": "Yearly",
      "price": 4999,
      "startDate": "2025-01-01",
      "endDate": "2025-12-31"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "profiles_edit", "profiles_delete", "match_profiles", "verification", "reports", "settings", "user_management"],
    "authMethod": "email"
  },
  {
    "id": "user_2",
    "name": "Rashi Mishra",
    "email": "rashi.mishra@shubhmilan.com",
    "mobile": "+91 9000000002",
    "role": "Admin",
    "status": "Active",
    "subscription": {
      "planId": "premium",
      "plan": "Premium",
      "type": "Yearly",
      "price": 4999,
      "startDate": "2025-01-15",
      "endDate": "2026-01-14"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "profiles_edit", "profiles_delete", "match_profiles", "verification", "reports", "settings"],
    "authMethod": "email"
  },
  {
    "id": "user_3",
    "name": "Kartikeya Misha",
    "email": "kartikeya.misha@shubhmilan.com",
    "mobile": "+91 9000000003",
    "role": "SuperAdmin",
    "status": "Active",
    "subscription": {
      "planId": "premium",
      "plan": "Premium",
      "type": "Yearly",
      "price": 4999,
      "startDate": "2025-02-01",
      "endDate": "2026-01-31"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "profiles_edit", "profiles_delete", "match_profiles", "verification", "reports", "settings", "user_management"],
    "authMethod": "email"
  },
  {
    "id": "user_4",
    "name": "Ravi Kumar",
    "email": "ravi@shubhmilan.com",
    "mobile": "+91 9876543210",
    "role": "Broker",
    "status": "Active",
    "subscription": {
      "planId": "free",
      "plan": "Free Trial",
      "type": "Trial",
      "price": 0,
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "match_profiles"],
    "authMethod": "mobile"
  },
  {
    "id": "user_5",
    "name": "Sneha Kapoor",
    "email": "sneha@shubhmilan.com",
    "mobile": "+91 9123456780",
    "role": "Broker",
    "status": "Active",
    "subscription": {
      "planId": "basic",
      "plan": "Basic",
      "type": "Monthly",
      "price": 499,
      "startDate": "2025-02-01",
      "endDate": "2025-02-28"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "profiles_edit", "match_profiles"],
    "authMethod": "mobile"
  },
  {
    "id": "user_6",
    "name": "Rohit Sharma",
    "email": "rohit@shubhmilan.com",
    "mobile": "+91 9988776655",
    "role": "Broker",
    "status": "Inactive",
    "subscription": {
      "planId": "standard",
      "plan": "Standard",
      "type": "Monthly",
      "price": 1299,
      "startDate": "2024-11-01",
      "endDate": "2025-01-31"
    },
    "moduleAccess": ["dashboard", "profiles_view", "match_profiles"],
    "authMethod": "mobile"
  },
  {
    "id": "user_7",
    "name": "Meera Iyer",
    "email": "meera@shubhmilan.com",
    "mobile": "+91 9090909090",
    "role": "Broker",
    "status": "Active",
    "subscription": {
      "planId": "premium",
      "plan": "Premium",
      "type": "Yearly",
      "price": 4999,
      "startDate": "2025-01-15",
      "endDate": "2026-01-14"
    },
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "profiles_edit", "match_profiles", "verification"],
    "authMethod": "mobile"
  },
  {
    "id": "user_8",
    "name": "Aditya Singh",
    "email": "aditya@shubhmilan.com",
    "mobile": "+91 8877665544",
    "role": "Broker",
    "status": "Active",
    "subscription": {
      "planId": "free",
      "plan": "Free Trial",
      "type": "Trial",
      "price": 0,
      "startDate": "2025-02-01",
      "endDate": "2025-02-28"
    },
    "moduleAccess": ["dashboard", "profiles_view"],
    "authMethod": "mobile"
  },
  {
    "id": "user_9",
    "name": "Anjali Verma",
    "email": "anjali@shubhmilan.com",
    "mobile": "+91 9876543219",
    "role": "Assistant",
    "status": "Active",
    "subscription": null,
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add", "verification"],
    "authMethod": "email"
  },
  {
    "id": "user_10",
    "name": "Deepak Gupta",
    "email": "deepak@shubhmilan.com",
    "mobile": "+91 9876543220",
    "role": "Assistant",
    "status": "Active",
    "subscription": null,
    "moduleAccess": ["dashboard", "profiles_view", "profiles_add"],
    "authMethod": "email"
  }
]