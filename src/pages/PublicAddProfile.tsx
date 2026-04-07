import { useEffect } from "react";
import { useParams } from "react-router";
import { AddProfileContent } from "@/pages/AddProfile";
import { ProfileDataProvider } from "@/context/ProfileDataContext";
import { useI18n } from "@/hooks/use-i18n";

export default function PublicAddProfile() {
  const { token } = useParams<{ token: string }>();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.nav.addProfile} - ${t.landing.appName}`;
  }, [t]);

  // If no token, show a minimal message
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Invalid link</h1>
          <p className="text-muted-foreground">This public form link is not valid.</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileDataProvider>
      <AddProfileContent publicMode publicToken={token} />
    </ProfileDataProvider>
  );
}
