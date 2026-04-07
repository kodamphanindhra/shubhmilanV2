import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SuperAdminUser, UserFormData, AVAILABLE_MODULES } from "@/types/superAdmin";
import { useI18n } from "@/hooks/use-i18n";

interface EditUserModalProps {
  user: SuperAdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, data: UserFormData) => void;
}

export function EditUserModal({ user, open, onOpenChange, onSave }: EditUserModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<UserFormData & { moduleAccess: string[] }>({
    name: "",
    email: "",
    mobile: "",
    role: "Broker",
    moduleAccess: [],
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        moduleAccess: user.moduleAccess || [],
      });
      setErrors({});
    }
  }, [user]);

  const toggleModule = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      moduleAccess: prev.moduleAccess.includes(module)
        ? prev.moduleAccess.filter((m) => m !== module)
        : [...prev.moduleAccess, module],
    }));
  };

  const getModuleLabel = (module: string): string => {
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
    return labels[module] || module;
  };

  const validateForm = () => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.validation.required;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t.validation.required;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t.validation.invalidEmail;
    }

    const mobileRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = t.validation.required;
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = t.validation.invalidMobile;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!user || !validateForm()) return;
    onSave(user.id, formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.superAdmin.editUser}</DialogTitle>
          <DialogDescription>{t.superAdmin.editUserDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <Label htmlFor="name">{t.settings.fullName}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.settings.fullName}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t.settings.email}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">{t.settings.mobile}</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder={t.settings.mobile}
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t.settings.role}</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "Broker" | "Admin" | "SuperAdmin" | "Assistant") =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Broker">{t.superAdmin.broker}</SelectItem>
                <SelectItem value="Admin">{t.superAdmin.admin}</SelectItem>
                <SelectItem value="SuperAdmin">{t.superAdmin.superAdmin}</SelectItem>
                <SelectItem value="Assistant">{t.superAdmin.assistant}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Module Access */}
          <div className="space-y-2">
            <Label>{t.superAdmin.moduleAccess || "Module Access Permissions"}</Label>
            <p className="text-sm text-muted-foreground">
              {t.superAdmin.selectModules || "Select modules this user can access"}
            </p>
            <div className="border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
              {AVAILABLE_MODULES.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${module}`}
                    checked={formData.moduleAccess.includes(module)}
                    onCheckedChange={() => toggleModule(module)}
                  />
                  <Label htmlFor={`edit-${module}`} className="cursor-pointer font-normal">
                    {getModuleLabel(module)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.actions.cancel}
          </Button>
          <Button onClick={handleSave}>{t.actions.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
