import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { NewUserFormData, AVAILABLE_MODULES } from "@/types/superAdmin";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: NewUserFormData) => Promise<void>;
}

export function AddUserModal({ open, onOpenChange, onSave }: AddUserModalProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewUserFormData, string>>>({});

  const [formData, setFormData] = useState<NewUserFormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "Broker",
    moduleAccess: [],
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewUserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.validation.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.validation.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validation.invalidEmail;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = t.validation.required;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = t.validation.invalidMobile;
    }

    if (!formData.password) {
      newErrors.password = t.validation.required;
    } else {
      if (formData.password.length < 8) {
        newErrors.password = t.validation.passwordMinLength;
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = t.validation.passwordUppercase;
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = t.validation.passwordNumber;
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = t.validation.passwordSpecial;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.validation.required;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.toast.passwordMismatch;
    }

    if (formData.moduleAccess.length === 0) {
      newErrors.moduleAccess = t.superAdmin.selectModules || "Please select at least one module";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      role: "Broker",
      moduleAccess: [],
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.superAdmin.createNewUser || "Create New User"}</DialogTitle>
          <DialogDescription>
            {t.superAdmin.createNewUserDescription || "Add a new user/broker to the system. All fields are required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t.settings.fullName} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.addProfile.placeholders.enterFullName}
              disabled={loading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.email} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t.addProfile.placeholders.emailExample}
              disabled={loading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobile">{t.superAdmin.mobileNumber || "Mobile Number"} *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder={t.addProfile.placeholders.mobileExample}
              disabled={loading}
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t.superAdmin.password || "Password"} *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t.settings.confirmPassword} *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder={t.settings.confirmPassword}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t.superAdmin.role} *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "Broker" | "Admin" | "Assistant") => setFormData({ ...formData, role: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Broker">{t.superAdmin.broker}</SelectItem>
                <SelectItem value="Admin">{t.superAdmin.admin}</SelectItem>
                <SelectItem value="Assistant">{t.superAdmin.assistant}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Module Access */}
          <div className="space-y-2">
            <Label>{t.superAdmin.moduleAccess || "Module Access Permissions"} *</Label>
            <p className="text-sm text-muted-foreground">
              {t.superAdmin.selectModules || "Select modules this user can access"}
            </p>
            <div className="border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
              {AVAILABLE_MODULES.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={module}
                    checked={formData.moduleAccess.includes(module)}
                    onCheckedChange={() => toggleModule(module)}
                    disabled={loading}
                  />
                  <Label htmlFor={module} className="cursor-pointer font-normal">
                    {getModuleLabel(module)}
                  </Label>
                </div>
              ))}
            </div>
            {errors.moduleAccess && <p className="text-sm text-destructive">{errors.moduleAccess}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              {t.actions.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.superAdmin.createUser || "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
