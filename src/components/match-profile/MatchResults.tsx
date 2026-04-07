import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileMatch } from "@/types/matchProfile";
import { Eye, Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface MatchResultsProps {
  matches: ProfileMatch[];
  loading: boolean;
  onViewProfile: (profile: ProfileMatch) => void;
  onShortlist: (profileId: string) => void;
  onContact: (profileId: string) => void;
}

export function MatchResults({ matches, loading, onViewProfile, onShortlist, onContact }: MatchResultsProps) {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-40 flex-col items-center justify-center text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mb-2 text-lg font-semibold">{t.matchProfile.noMatches}</h3>
          <p className="text-sm text-muted-foreground">{t.matchProfile.noMatchesDesc}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-h-screen">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t.matchProfile.showing} {startIndex + 1}-{Math.min(endIndex, matches.length)} {t.profiles.of} {matches.length} {t.matchProfile.matchesFound}
        </p>
      </div>

      {/* Results Grid - 1 column mobile, 2 tablet, 3 desktop */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentMatches.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="p-3 sm:p-4">
                {/* Profile Header */}
                <div className="mb-2 sm:mb-3 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{profile.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {profile.age} {t.profiles.years}
                    </p>
                  </div>
                  <Badge variant={profile.verified ? "default" : "secondary"} className="text-xs ml-2 shrink-0">
                    {profile.verified ? t.profiles.verified : t.profiles.pending}
                  </Badge>
                </div>

                {/* Profile Details */}
                <div className="mb-3 sm:mb-4 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <p className="text-muted-foreground truncate">{profile.occupation}</p>
                  <p className="text-muted-foreground truncate">{profile.city}, {profile.state}</p>
                  {profile.caste && <p className="text-muted-foreground truncate">{profile.caste}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs sm:text-sm"
                    onClick={() => onViewProfile(profile)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    {t.actions.view}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto h-9"
          >
            {t.matchProfile.previous}
          </Button>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {t.matchProfile.page} {currentPage} {t.profiles.of} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto h-9"
          >
            {t.matchProfile.next}
          </Button>
        </div>
      )}
    </div>
  );
}