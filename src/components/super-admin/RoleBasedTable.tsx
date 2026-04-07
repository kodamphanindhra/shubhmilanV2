import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { UserCard } from "./UserCard";
import { SuperAdminUser } from "@/types/superAdmin";
import { useIsMobile } from "@/hooks/use-mobile";

interface RoleBasedTableProps {
  title: string;
  users: SuperAdminUser[];
  showSubscription?: boolean;
  onView: (user: SuperAdminUser) => void;
  onEdit: (user: SuperAdminUser) => void;
  onToggleStatus: (user: SuperAdminUser) => void;
  onAssignSubscription?: (user: SuperAdminUser) => void;
}

export function RoleBasedTable({
  title,
  users,
  showSubscription = false,
  onView,
  onEdit,
  onToggleStatus,
  onAssignSubscription,
}: RoleBasedTableProps) {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : isMobile ? (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={onView}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onAssignSubscription={showSubscription && onAssignSubscription ? onAssignSubscription : () => {}}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <UserTable
              users={users}
              onView={onView}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onAssignSubscription={showSubscription && onAssignSubscription ? onAssignSubscription : () => {}}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
