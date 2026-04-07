import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MOCK_USER_PROFILE } from "@/mockData/settings";
import { PasswordModal } from "./PasswordModal";


export function ProfileForm() {
  const { t } = useI18n();
  const userProfile = useQuery(api.settings.getUserProfile);
  const updateProfile = useMutation(api.settings.updateProfile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Use mock data as fallback
  const profile = userProfile || MOCK_USER_PROFILE;

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setRole(profile.role || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        name,
        mobile,
      });
      toast.success(t.toast.profileUpdated);
    } catch (error) {
      toast.error(t.toast.profileUpdateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.profileTitle}</CardTitle>
          <CardDescription>{t.settings.profileSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {t.settings.fullName} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t.settings.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">{t.settings.mobile}</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">{t.settings.role}</Label>
              <Input
                id="role"
                value={role}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.settings.updateProfile}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordModalOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {t.settings.changePassword}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
      />
    </>
  );
}
