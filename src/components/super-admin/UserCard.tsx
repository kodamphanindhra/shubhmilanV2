import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuperAdminUser } from "@/types/superAdmin";
import { Edit, Eye, Power, CreditCard, Mail, Phone } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface UserCardProps {
  user: SuperAdminUser;
  onView: (user: SuperAdminUser) => void;
  onEdit: (user: SuperAdminUser) => void;
  onToggleStatus: (user: SuperAdminUser) => void;
  onAssignSubscription: (user: SuperAdminUser) => void;
}

export function UserCard({ user, onView, onEdit, onToggleStatus, onAssignSubscription }: UserCardProps) {
  const { t } = useI18n();

  const getRoleBadgeVariant = (role: string) => {
    if (role === "SuperAdmin") return "default";
    if (role === "Admin") return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                {user.status === "Active" ? t.superAdmin.active : t.superAdmin.inactive}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{user.mobile}</span>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="space-y-1 text-sm">
          <div className="font-medium">{t.superAdmin.subscription}</div>
          <div className="text-muted-foreground">
            {user.subscription ? user.subscription.plan : t.superAdmin.noSubscription}
          </div>
          {user.subscription && (
            <div className="text-xs text-muted-foreground">
              {user.subscription.startDate} - {user.subscription.endDate}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(user)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            {t.actions.view}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(user)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            {t.actions.edit}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(user)}
            className="flex-1"
          >
            <Power className="h-4 w-4 mr-2" />
            {user.status === "Active" ? t.superAdmin.deactivate : t.superAdmin.activate}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssignSubscription(user)}
            className="flex-1"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {t.superAdmin.assignSubscription}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
