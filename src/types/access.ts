// Access key type definitions for RBAC system
export const ACCESS_KEYS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",
  
  // Profiles
  PROFILES_VIEW: "profiles.view",
  PROFILES_ADD: "profiles.add",
  PROFILES_EDIT: "profiles.edit",
  PROFILES_DELETE: "profiles.delete",
  
  // Match Profile
  MATCH_PROFILE_VIEW: "match-profile.view",
  MATCH_PROFILE_FILTER: "match-profile.filter",
  MATCH_PROFILE_SHARE: "match-profile.share",
  
  // Subscription
  SUBSCRIPTION_VIEW: "subscription.view",
  SUBSCRIPTION_PURCHASE: "subscription.purchase",
  SUBSCRIPTION_MANAGE: "subscription.manage",
  
  // Settings
  SETTINGS_PROFILE: "settings.profile",
  SETTINGS_SUBSCRIPTION: "settings.subscription",
  SETTINGS_SUPPORT: "settings.support",
  SETTINGS_PRIVACY: "settings.privacy",
  SETTINGS_LANGUAGE: "settings.language",
  
  // Super Admin
  SUPERADMIN_VIEW: "superadmin.view",
  SUPERADMIN_MANAGE_USERS: "superadmin.manage-users",
  SUPERADMIN_ASSIGN_ACCESS: "superadmin.assign-access",
  SUPERADMIN_MANAGE_SUBSCRIPTIONS: "superadmin.manage-subscriptions",
  
  // Roles
  ASSISTANTS_VIEW: "assistants.view",
  ADMINS_VIEW: "admins.view",
} as const;

export type AccessKey = typeof ACCESS_KEYS[keyof typeof ACCESS_KEYS];

// Helper function to map module access to granular access keys
export function mapModuleAccessToKeys(moduleAccess: string[]): string[] {
  const accessKeys: string[] = [];
  
  moduleAccess.forEach((module) => {
    switch (module) {
      case "dashboard":
        accessKeys.push(ACCESS_KEYS.DASHBOARD_VIEW);
        break;
      case "profiles_view":
        accessKeys.push(ACCESS_KEYS.PROFILES_VIEW);
        break;
      case "profiles_add":
        accessKeys.push(ACCESS_KEYS.PROFILES_ADD);
        break;
      case "profiles_edit":
        accessKeys.push(ACCESS_KEYS.PROFILES_EDIT);
        break;
      case "profiles_delete":
        accessKeys.push(ACCESS_KEYS.PROFILES_DELETE);
        break;
      case "match_profiles":
        accessKeys.push(ACCESS_KEYS.MATCH_PROFILE_VIEW, ACCESS_KEYS.MATCH_PROFILE_FILTER);
        break;
      case "verification":
        accessKeys.push(ACCESS_KEYS.PROFILES_EDIT);
        break;
      case "reports":
        accessKeys.push(ACCESS_KEYS.DASHBOARD_VIEW);
        break;
      case "settings":
        accessKeys.push(
          ACCESS_KEYS.SETTINGS_PROFILE,
          ACCESS_KEYS.SETTINGS_SUBSCRIPTION,
          ACCESS_KEYS.SETTINGS_SUPPORT,
          ACCESS_KEYS.SETTINGS_LANGUAGE
        );
        break;
      case "user_management":
        accessKeys.push(
          ACCESS_KEYS.SUPERADMIN_VIEW,
          ACCESS_KEYS.SUPERADMIN_MANAGE_USERS,
          ACCESS_KEYS.SUPERADMIN_ASSIGN_ACCESS
        );
        break;
    }
  });
  
  return accessKeys;
}

// Role-based default access
export const ROLE_DEFAULT_ACCESS: Record<string, string[]> = {
  SuperAdmin: Object.values(ACCESS_KEYS),
  Admin: [
    ACCESS_KEYS.DASHBOARD_VIEW,
    ACCESS_KEYS.PROFILES_VIEW,
    ACCESS_KEYS.PROFILES_ADD,
    ACCESS_KEYS.PROFILES_EDIT,
    ACCESS_KEYS.PROFILES_DELETE,
    ACCESS_KEYS.MATCH_PROFILE_VIEW,
    ACCESS_KEYS.MATCH_PROFILE_FILTER,
    ACCESS_KEYS.SUBSCRIPTION_VIEW,
    ACCESS_KEYS.SETTINGS_PROFILE,
    ACCESS_KEYS.SETTINGS_SUBSCRIPTION,
    ACCESS_KEYS.SETTINGS_SUPPORT,
    ACCESS_KEYS.SETTINGS_LANGUAGE,
  ],
  Assistant: [
    ACCESS_KEYS.DASHBOARD_VIEW,
    ACCESS_KEYS.PROFILES_VIEW,
    ACCESS_KEYS.SETTINGS_PROFILE,
    ACCESS_KEYS.SETTINGS_LANGUAGE,
  ],
  Broker: [
    ACCESS_KEYS.DASHBOARD_VIEW,
    ACCESS_KEYS.PROFILES_VIEW,
    ACCESS_KEYS.PROFILES_ADD,
    ACCESS_KEYS.MATCH_PROFILE_VIEW,
    ACCESS_KEYS.SUBSCRIPTION_VIEW,
    ACCESS_KEYS.SETTINGS_PROFILE,
    ACCESS_KEYS.SETTINGS_SUBSCRIPTION,
    ACCESS_KEYS.SETTINGS_SUPPORT,
    ACCESS_KEYS.SETTINGS_LANGUAGE,
  ],
};
