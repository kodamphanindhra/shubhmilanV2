import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileListItem } from "@/components/ProfileListItem";
import type { PendingProfile } from "@/types/api";
import { mockDashboardResponse } from "@/mockData/dashboard";
import { useI18n } from "@/hooks/use-i18n";
import { useNavigate } from "react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type PendingVerificationProps = {
  profiles?: PendingProfile[];
  loading?: boolean;
};

export function PendingVerification({ profiles, loading }: PendingVerificationProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const displayProfiles =
    (profiles?.length ?? 0) > 0 ? profiles! : mockDashboardResponse.recentPending;
  const sortedProfiles = [...displayProfiles].sort((a, b) => a.name.localeCompare(b.name));

  if (loading && (profiles == null || profiles.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.pendingVerification}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="flex h-full"
    >
      <Card className="flex flex-col flex-1 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            {t.dashboard.pendingVerification}
            {displayProfiles.length > 1 ? "s" : ""}
            <Badge variant="destructive">{displayProfiles.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/profiles?status=pending")}>
            {t.dashboard.viewAll}
          </Button>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          {displayProfiles.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t.dashboard.noPendingVerifications}
            </p>
          ) : (
            <div className="space-y-3">
              {sortedProfiles.slice(0, 5).map((profile) => {
                const location = profile?.preferredLocation?.[0] ?? "N/A";
                return (
                  <ProfileListItem
                    key={profile._id}
                    name={profile?.name ?? "Unknown"}
                    age={undefined}
                    location={location}
                    gender={profile?.gender}
                    verified={false}
                    onAction={() =>
                      toast.info("This is sample data and cannot be verified in the mock environment.")
                    }
                    verifiedLabel={t.profiles.verified}
                    pendingLabel={t.profiles.pending}
                    yearsLabel={t.profiles.years}
                    trailingActions={undefined}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}