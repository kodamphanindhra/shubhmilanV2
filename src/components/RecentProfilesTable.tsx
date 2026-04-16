import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileListItem } from "@/components/ProfileListItem";
// import { api } from "@/convex/_generated/api";
import { useI18n } from "@/hooks/use-i18n";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { mockDashboardResponse } from "@/mockData/dashboard";
import ProfileDetailsModal from "@/components/profile/ProfileDetailsModal";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ProfileActionMenu } from "@/components/profiles/ProfileActionMenu";
import { ShareProfileModal } from "@/components/profiles/ShareProfileModal";
import type { Profile } from "@/types/api";

type RecentProfilesTableProps = {
  profiles?: Profile[];
  loading?: boolean;
};

export const api ={}

export function RecentProfilesTable({ profiles, loading }: RecentProfilesTableProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const { user } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [profileToShare, setProfileToShare] = useState<Profile | null>(null);

  const computeAge = (dob?: string): number | undefined => {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  const fallbackProfiles = mockDashboardResponse.recentVerified;
  const displayProfiles = (profiles?.length ?? 0) > 0 ? profiles! : fallbackProfiles;
  const sortedProfiles = [...displayProfiles].sort((a, b) => a.name.localeCompare(b.name));

  if (loading && (profiles == null || profiles.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentProfiles}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // New: handlers for menu actions
  const handleEdit = (profile: any) => {
    setSelectedProfileId(profile?._id ?? null);
    setSelectedProfile(profile);
  };
  const handleDelete = (profile: any) => {
    toast.info(`Delete profile: ${profile.name}`);
  };
  // Add: Share handler so menu opens share modal with link options
  const handleShare = (profile: any) => {
    setProfileToShare(profile);
    setShareModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="flex h-full"
    >
      <Card className="flex flex-col flex-1 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>{t.dashboard.recentProfiles}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/profiles")}>
            {t.dashboard.viewAll}
          </Button>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          {displayProfiles.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t.dashboard.noProfilesYet}
            </p>
          ) : (
            <div className="space-y-3">
              {sortedProfiles.slice(0, 5).map((profile) => {
                const age = computeAge(profile?.dob);
                const locationParts = [profile?.city, profile?.state].filter(Boolean);
                const location =
                  locationParts.length > 0 ? locationParts.join(", ") : profile?.country ?? "N/A";
                const verified = profile?.status?.toLowerCase() === "verified" || profile?.status?.toLowerCase() === "active";

                return (
                  <ProfileListItem
                    key={profile._id}
                    name={profile?.name ?? "Unknown"}
                    age={age}
                    gender={profile?.gender}
                    location={location}
                    verified={!!verified}
                    onAction={() => {
                      setSelectedProfileId(profile?._id ?? null);
                      setSelectedProfile(profile);
                    }}
                    verifiedLabel={t.profiles.verified}
                    pendingLabel={t.profiles.pending}
                    yearsLabel={t.profiles.years}
                    trailingActions={
                      <ProfileActionMenu
                        userRole={user?.role}
                        onEdit={() => handleEdit(profile)}
                        onDelete={() => handleDelete(profile)}
                        onShare={() => handleShare(profile)}
                      />
                    }
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileDetailsModal
        open={!!selectedProfileId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProfileId(null);
            setSelectedProfile(null);
          }
        }}
        profileId={selectedProfileId}
        initialProfile={selectedProfile ?? undefined}
      />

      <ShareProfileModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        onConfirm={(action) => {
          if (action === "cancel") {
            toast.info("Share cancelled");
            return;
          }
          const contactInfo =
            action === "with-contact" ? "with contact details" : "without contact details";
          toast.success(`Profile link ready ${contactInfo}`);
        }}
        profileName={profileToShare?.name}
        profileId={profileToShare?._id}
      />
    </motion.div>
  );
}