import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileMatch } from "@/types/matchProfile";
import { User, MapPin, GraduationCap, Briefcase, Users as UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SelectedProfileCardProps {
  profile: ProfileMatch | null;
}

export function SelectedProfileCard({ profile }: SelectedProfileCardProps) {
  const { t } = useI18n();

  if (!profile) {
    return (
      <Card className="">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <User className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>{t.matchProfile.noProfileSelected}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t.matchProfile.selectedProfile}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name and Gender */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {profile.age} {t.profiles.years}
              </p>
            </div>
            <Badge variant={profile.gender === "male" ? "default" : "secondary"}>
              {profile.gender === "male" ? t.profiles.male : t.profiles.female}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{t.profiles.education}</p>
                <p className="text-sm font-medium">{profile.education}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{t.profiles.occupation}</p>
                <p className="text-sm font-medium">{profile.occupation}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{t.profiles.location}</p>
                <p className="text-sm font-medium">
                  {profile.city}, {profile.state}
                </p>
              </div>
            </div>

            {profile.caste && (
              <div className="flex items-center gap-3">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t.profiles.caste}</p>
                  <p className="text-sm font-medium">{profile.caste}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{t.profiles.maritalStatus}</p>
                <p className="text-sm font-medium capitalize">{profile.maritalStatus}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
