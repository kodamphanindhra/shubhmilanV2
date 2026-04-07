import { Sidebar } from "@/components/Sidebar";
import { ProfileSelect } from "@/components/match-profile/ProfileSelect";
import { SelectedProfileCard } from "@/components/match-profile/SelectedProfileCard";
import { MatchFilters } from "@/components/match-profile/MatchFilters";
import { MatchResults } from "@/components/match-profile/MatchResults";
import { ProfileDetailModal } from "@/components/match-profile/ProfileDetailModal";
import { useMatchProfile } from "@/hooks/useMatchProfile";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileMatch } from "@/types/matchProfile";
import { Loader2, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MatchProfile() {
  const { isLoading, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const {
    profiles,
    selectedProfile,
    setSelectedProfile,
    filters,
    updateFilters,
    clearFilters,
    clearSelection,
    matches,
    loading,
  } = useMatchProfile();

  const [viewingProfile, setViewingProfile] = useState<ProfileMatch | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleViewProfile = (profile: ProfileMatch) => {
    setViewingProfile(profile);
    setModalOpen(true);
  };

  const handleShortlist = (profileId: string) => {
    toast.success(t.matchProfile.shortlisted);
    // TODO: Implement shortlist API call
  };

  const handleContact = (profileId: string) => {
    toast.success(t.matchProfile.contactInitiated);
    // TODO: Implement contact API call
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col md:flex-row md:h-screen md:overflow-hidden">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.matchProfile.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{t.matchProfile.subtitle}</p>
          </div>

          {/* Two Column Layout - Stacks on mobile, side-by-side on desktop */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[350px_1fr]">
            {/* Left Column: Profile Selection */}
            <div className="space-y-4 sm:space-y-6">
              <ProfileSelect
                profiles={profiles}
                selectedProfile={selectedProfile}
                onSelect={setSelectedProfile}
                onClear={clearSelection}
              />
              <SelectedProfileCard profile={selectedProfile} />
            </div>

            {/* Right Column: Filter Button and Results */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">{t.matchProfile.matchingProfiles}</h2>
                <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={!selectedProfile}>
                      <Filter className="mr-2 h-4 w-4" />
                      {t.matchProfile.filters}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t.matchProfile.filters}</DialogTitle>
                    </DialogHeader>
                    <MatchFilters
                      filters={filters}
                      onFilterChange={updateFilters}
                      onClearFilters={clearFilters}
                      onClose={() => setFilterModalOpen(false)}
                      disabled={!selectedProfile}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <MatchResults
                matches={matches}
                loading={loading}
                onViewProfile={handleViewProfile}
                onShortlist={handleShortlist}
                onContact={handleContact}
              />
            </div>
          </div>
        </div>
        </div>

        {/* Profile Detail Modal */}
        <ProfileDetailModal
          profile={viewingProfile}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>

    </div>
  );
}