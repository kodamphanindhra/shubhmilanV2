import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProfile } from "@/services/api/profile.api";
import { ProfileDetailModal } from "@/components/match-profile/ProfileDetailModal";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

type AnyProfile = Record<string, any>;

export default function PublicProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AnyProfile | null>(null);

  // Parse search param contact=1/0 without relying on react-router-dom
  const contactParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("contact") : "1";
  const showContactInfo = contactParam === "1";

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const p = await getProfile(id);
        if (isMounted) setProfile(p as AnyProfile | null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">{t?.profiles?.profileDetails || "Profile"}</p>
          <p className="text-sm text-muted-foreground mt-2">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Render as a modal always open; closing navigates to home */}
      <ProfileDetailModal
        profile={profile as any}
        open={true}
        // Prevent closing in public view; disable navigation
        onOpenChange={() => {}}
        showContactInfo={showContactInfo}
        showShareButton={false}
        // Hide the X close button in public view
        showCloseButton={false}
      />
    </div>
  );
}