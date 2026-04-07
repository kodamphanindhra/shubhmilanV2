import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { UserFilters } from "@/components/super-admin/UserFilters";
import { RoleBasedTable } from "@/components/super-admin/RoleBasedTable";
import { EditUserModal } from "@/components/super-admin/EditUserModal";
import { AssignSubscriptionModal } from "@/components/super-admin/AssignSubscriptionModal";
import { ViewUserModal } from "@/components/super-admin/ViewUserModal";
import { ConfirmationModal } from "@/components/super-admin/ConfirmationModal";
import { AddUserModal } from "@/components/super-admin/AddUserModal";
import { SuperAdminUser, UserFormData, SubscriptionFormData, NewUserFormData } from "@/types/superAdmin";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const { t } = useI18n();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const {
    allUsers,
    loading,
    filters,
    setFilters,
    updateUser,
    assignSubscription,
    toggleUserStatus,
    addUser,
    resetFilters,
  } = useSuperAdmin();

  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationDescription, setConfirmationDescription] = useState("");

  useEffect(() => {
    document.title = `${t.superAdmin.title} - ${t.landing.appName}`;
  }, [t]);

  // Filter users by role
  const superAdmins = useMemo(() => allUsers.filter(u => u.role === "SuperAdmin"), [allUsers]);
  const admins = useMemo(() => allUsers.filter(u => u.role === "Admin"), [allUsers]);
  const assistants = useMemo(() => allUsers.filter(u => u.role === "Assistant"), [allUsers]);
  const brokers = useMemo(() => allUsers.filter(u => u.role === "Broker"), [allUsers]);

  const handleView = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (userId: string, data: UserFormData) => {
    await updateUser(userId, data);
    toast.success(t.toast.profileUpdated);
  };

  const handleAddUser = async (data: NewUserFormData) => {
    await addUser(data);
    toast.success(t.superAdmin.userCreated || "User created successfully");
  };

  const handleAssignSubscription = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setSubscriptionModalOpen(true);
  };

  const handleSaveSubscription = async (userId: string, data: SubscriptionFormData) => {
    await assignSubscription(userId, data);
    toast.success(t.superAdmin.subscriptionAssigned);
  };

  const handleToggleStatus = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setConfirmationTitle(
      user.status === "Active" ? t.superAdmin.deactivateUser : t.superAdmin.activateUser
    );
    setConfirmationDescription(
      user.status === "Active"
        ? t.superAdmin.deactivateUserDescription
        : t.superAdmin.activateUserDescription
    );
    setConfirmationAction(() => async () => {
      await toggleUserStatus(user.id);
      toast.success(
        user.status === "Active" ? t.superAdmin.userDeactivated : t.superAdmin.userActivated
      );
    });
    setConfirmationModalOpen(true);
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setConfirmationModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-y-auto">
        {isMobile && <div className="h-16" />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container max-w-7xl py-6 px-4 md:px-6"
        >
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.superAdmin.title}</h1>
              <p className="text-muted-foreground mt-2">{t.superAdmin.subtitle}</p>
            </div>
            <Button onClick={() => setAddUserModalOpen(true)} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              {t.superAdmin.addUser || "Add User"}
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <UserFilters filters={filters} onFilterChange={setFilters} onReset={resetFilters} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">{t.common.loading}</p>
              </div>
            </div>
          )}

          {/* Role-Based Tables Grid */}
          {!loading && (
            <div className="flex flex-col gap-6">
              <RoleBasedTable
                title={t.superAdmin.superAdmin + "s"}
                users={superAdmins}
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
              <RoleBasedTable
                title={t.superAdmin.admin + "s"}
                users={admins}
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
              <RoleBasedTable
                title={t.superAdmin.assistant || "Assistant" + "s"}
                users={assistants}
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
              <RoleBasedTable
                title={t.superAdmin.broker + "s"}
                users={brokers}
                showSubscription={true}
                onView={handleView}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onAssignSubscription={handleAssignSubscription}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <ViewUserModal user={selectedUser} open={viewModalOpen} onOpenChange={setViewModalOpen} />
      <EditUserModal
        user={selectedUser}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveUser}
      />
      <AssignSubscriptionModal
        user={selectedUser}
        open={subscriptionModalOpen}
        onOpenChange={setSubscriptionModalOpen}
        onAssign={handleSaveSubscription}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        onConfirm={handleConfirm}
        title={confirmationTitle}
        description={confirmationDescription}
      />
      <AddUserModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onSave={handleAddUser}
      />
    </div>
  );
}