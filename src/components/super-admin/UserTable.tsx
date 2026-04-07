import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SuperAdminUser } from "@/types/superAdmin";
import { Edit, Eye, Power, CreditCard } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface UserTableProps {
  users: SuperAdminUser[];
  onView: (user: SuperAdminUser) => void;
  onEdit: (user: SuperAdminUser) => void;
  onToggleStatus: (user: SuperAdminUser) => void;
  onAssignSubscription: (user: SuperAdminUser) => void;
}

export function UserTable({ users, onView, onEdit, onToggleStatus, onAssignSubscription }: UserTableProps) {
  const { t } = useI18n();

  const getRoleBadgeVariant = (role: string) => {
    if (role === "SuperAdmin") return "default";
    if (role === "Admin") return "secondary";
    return "outline";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.superAdmin.name}</TableHead>
          <TableHead>{t.superAdmin.email}</TableHead>
          <TableHead className="hidden md:table-cell">{t.superAdmin.mobile}</TableHead>
          <TableHead>{t.superAdmin.role}</TableHead>
          <TableHead className="hidden lg:table-cell">{t.superAdmin.subscription}</TableHead>
          <TableHead>{t.superAdmin.status}</TableHead>
          <TableHead className="hidden xl:table-cell">{t.superAdmin.startDate}</TableHead>
          <TableHead className="hidden xl:table-cell">{t.superAdmin.endDate}</TableHead>
          <TableHead className="text-right">{t.superAdmin.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {user.subscription ? user.subscription.plan : t.superAdmin.noSubscription}
            </TableCell>
            <TableCell>
              <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                {user.status === "Active" ? t.superAdmin.active : t.superAdmin.inactive}
              </Badge>
            </TableCell>
            <TableCell className="hidden xl:table-cell">
              {user.subscription?.startDate || "-"}
            </TableCell>
            <TableCell className="hidden xl:table-cell">
              {user.subscription?.endDate || "-"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onView(user)} title={t.actions.view}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(user)} title={t.actions.edit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(user)}
                  title={user.status === "Active" ? t.superAdmin.deactivate : t.superAdmin.activate}
                >
                  <Power className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAssignSubscription(user)}
                  title={t.superAdmin.assignSubscription}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
