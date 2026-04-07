import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SuperAdminUser } from "@/types/superAdmin";
import { Mail, Phone, Calendar, CreditCard } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface ViewUserModalProps {
  user: SuperAdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserModal({ user, open, onOpenChange }: ViewUserModalProps) {
  const { t } = useI18n();

  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    if (role === "SuperAdmin") return "default";
    if (role === "Admin") return "secondary";
    return "outline";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.superAdmin.userDetails}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                  {user.status === "Active" ? t.superAdmin.active : t.superAdmin.inactive}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.mobile}</span>
              </div>
            </div>
          </div>

          {/* Authentication Method */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">{t.superAdmin.authMethod || "Authentication Method"}</h4>
            <div className="text-sm pl-6">
              {user.authMethod === "mobile" ? "Mobile + Password" : "Email OTP"}
            </div>
          </div>

          {/* Module Access */}
          {user.moduleAccess && user.moduleAccess.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium">{t.superAdmin.moduleAccess || "Module Access"}</h4>
              <div className="pl-6 space-y-2">
                {user.moduleAccess.map((module) => {
                  const labels: Record<string, string> = {
                    dashboard: t.superAdmin.dashboardAccess || "Dashboard Access",
                    profiles_view: t.superAdmin.profilesView || "View Profiles",
                    profiles_add: t.superAdmin.profilesAdd || "Add Profiles",
                    profiles_edit: t.superAdmin.profilesEdit || "Edit Profiles",
                    profiles_delete: t.superAdmin.profilesDelete || "Delete Profiles",
                    match_profiles: t.superAdmin.matchProfilesAccess || "Match Profiles",
                    verification: t.superAdmin.verificationAccess || "Verification System",
                    reports: t.superAdmin.reportsAccess || "Reports & Analytics",
                    settings: t.superAdmin.settingsAccess || "Settings",
                    user_management: t.superAdmin.userManagementAccess || "User Management",
                  };
                  return (
                    <div key={module} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {labels[module] || module}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subscription Info */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">{t.superAdmin.subscription}</h4>
            </div>
            
            {user.subscription ? (
              <div className="space-y-2 pl-6">
                <div className="text-sm">
                  <span className="font-medium">{t.superAdmin.plan}:</span>{" "}
                  {user.subscription.plan}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{t.superAdmin.type}:</span>{" "}
                  {user.subscription.type}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{t.superAdmin.price}:</span>{" "}
                  ₹{user.subscription.price}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>
                    {user.subscription.startDate} - {user.subscription.endDate}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground pl-6">
                {t.superAdmin.noSubscription}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
