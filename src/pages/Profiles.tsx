import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebar } from "@/components/Sidebar";
import { ProfileActionMenu } from "@/components/profiles/ProfileActionMenu";
import { ShareProfileModal } from "@/components/profiles/ShareProfileModal";
import ProfileDetailsModal from "@/components/profile/ProfileDetailsModal";
import { mockProfiles } from "@/mockData/profiles";
import { useI18n } from "@/hooks/use-i18n";
import { motion } from "framer-motion";
import {
  Filter,
  Loader2,
  Search,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { listProfiles } from "../services/api";

export default function Profiles() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const { data: listOfProfiles, loading: profilesLoading } = useApi(listProfiles);
  console.log("List of profiles:", listOfProfiles);
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [religionFilter, setReligionFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  // Apply filter from URL params on mount
  useEffect(() => {
    const statusParam = searchParams.get("status");
    const genderParam = searchParams.get("gender");

    if (statusParam === "pending" || statusParam === "verified") {
      setVerifiedFilter((prev) => (prev === statusParam ? prev : statusParam));
    } else if (!statusParam) {
      setVerifiedFilter((prev) => (prev === "all" ? prev : "all"));
    }

    if (genderParam === "male" || genderParam === "female") {
      setGenderFilter((prev) => (prev === genderParam ? prev : genderParam));
    } else if (!genderParam) {
      setGenderFilter((prev) => (prev === "all" ? prev : "all"));
    }
  }, [searchParams]);
  
  const [selectedProfile, setSelectedProfile] = useState<typeof mockProfiles[0] | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [profileToShare, setProfileToShare] = useState<typeof mockProfiles[0] | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter profiles based on search and filters
  const filteredProfiles = useMemo(() => {
    const filtered = mockProfiles.filter((profile) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Gender filter
      const matchesGender =
        genderFilter === "all" || profile.gender === genderFilter;

      // Religion filter
      const matchesReligion =
        religionFilter === "all" || profile.religion === religionFilter;

      // Verified filter
      const matchesVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" && profile.verified) ||
        (verifiedFilter === "pending" && !profile.verified);

      return matchesSearch && matchesGender && matchesReligion && matchesVerified;
    });
    
    // Sort alphabetically by name (A-Z)
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, genderFilter, religionFilter, verifiedFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, religionFilter, verifiedFilter]);

  // Add: Clamp current page when total pages shrink after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  // Handle row click to open details dialog instead of navigating
  const handleRowClick = (profile: typeof mockProfiles[0]) => {
    setSelectedProfile(profile);
  };

  // Handle share action
  const handleShare = (profile: typeof mockProfiles[0]) => {
    setProfileToShare(profile);
    setShareModalOpen(true);
  };

  const handleShareConfirm = (action: "with-contact" | "without-contact" | "cancel") => {
    if (action === "cancel") {
      toast.info("Share cancelled");
      return;
    }
    
    const contactInfo = action === "with-contact" ? "with contact details" : "without contact details";
    toast.success(`Profile shared ${contactInfo}`);
  };

  // Handle edit action
  const handleEdit = (profile: typeof mockProfiles[0]) => {
    toast.info(`Edit profile: ${profile.name}`);
    // Navigate to edit page or open edit modal
  };

  // Handle delete action
  const handleDelete = (profile: typeof mockProfiles[0]) => {
    toast.info(`Delete profile: ${profile.name}`);
    // Show delete confirmation
  };

  // Show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row md:h-screen md:overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.profiles.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t.profiles.subtitle}
            </p>
          </motion.div>

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="mb-4 sm:mb-6">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t.profiles.searchAndFilters}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Search Input */}
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.profiles.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full"
                    />
                  </div>

                  {/* Gender Filter */}
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.profiles.gender} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.profiles.allGenders}</SelectItem>
                      <SelectItem value="male">{t.profiles.male}</SelectItem>
                      <SelectItem value="female">{t.profiles.female}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Religion Filter */}
                  <Select value={religionFilter} onValueChange={setReligionFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.profiles.religion} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.profiles.allReligions}</SelectItem>
                      <SelectItem value="Hindu">{t.profiles.hindu}</SelectItem>
                      <SelectItem value="Sikh">{t.profiles.sikh}</SelectItem>
                      <SelectItem value="Muslim">{t.profiles.muslim}</SelectItem>
                      <SelectItem value="Christian">{t.profiles.christian}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Verified Filter */}
                  <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.profiles.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.profiles.allStatus}</SelectItem>
                      <SelectItem value="verified">{t.profiles.verified}</SelectItem>
                      <SelectItem value="pending">{t.profiles.pending}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || genderFilter !== "all" || religionFilter !== "all" || verifiedFilter !== "all") && (
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t.profiles.showing} {filteredProfiles.length} {t.profiles.of} {mockProfiles.length} {t.profiles.profilesCount}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setGenderFilter("all");
                        setReligionFilter("all");
                        setVerifiedFilter("all");
                      }}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                      {t.profiles.clearFilters}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Profiles Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                  {t.profiles.title} ({filteredProfiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProfiles.length === 0 ? (
                  <div className="py-12 text-center">
                    <User className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-base sm:text-lg font-semibold">{t.profiles.noProfilesFound}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {t.profiles.noProfilesDesc}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Card View, Desktop: Table View */}
                    <div className="block md:hidden space-y-3">
                      {paginatedProfiles.map((profile) => (
                        <Card 
                          key={profile.id} 
                          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => handleRowClick(profile)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-base">{profile.name}</h3>
                              <p className="text-sm text-muted-foreground">{profile.age} {t.profiles.years}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={profile.verified ? "default" : "secondary"} className={profile.verified ? "" : "bg-[#F0F8F5] text-foreground"}>
                                {profile.verified ? t.profiles.verified : t.profiles.pending}
                              </Badge>
                              <ProfileActionMenu
                                userRole={user?.role}
                                onEdit={() => handleEdit(profile)}
                                onDelete={() => handleDelete(profile)}
                                onShare={() => handleShare(profile)}
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5 text-sm mb-3">
                            <p className="text-muted-foreground capitalize">{profile.gender}</p>
                            <p className="text-muted-foreground">{profile.education}</p>
                            <p className="text-muted-foreground">{profile.occupation}</p>
                            <p className="text-muted-foreground">{profile.city}, {profile.state}</p>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">S.No</TableHead>
                            <TableHead>{t.profiles.name}</TableHead>
                            <TableHead>{t.profiles.age}</TableHead>
                            <TableHead>{t.profiles.gender}</TableHead>
                            <TableHead>{t.profiles.education}</TableHead>
                            <TableHead>{t.profiles.occupation}</TableHead>
                            <TableHead>{t.profiles.location}</TableHead>
                            <TableHead>{t.profiles.status}</TableHead>
                            <TableHead className="text-right">{t.profiles.action}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedProfiles.map((profile, idx) => (
                            <TableRow 
                              key={profile.id}
                              className="cursor-pointer hover:bg-accent/50"
                              onClick={() => handleRowClick(profile)}
                            >
                              <TableCell>{startIndex + idx + 1}</TableCell>
                              <TableCell className="font-medium">
                                {profile.name}
                              </TableCell>
                              <TableCell>{profile.age}</TableCell>
                              <TableCell className="capitalize">
                                {profile.gender}
                              </TableCell>
                              <TableCell>{profile.education}</TableCell>
                              <TableCell>{profile.occupation}</TableCell>
                              <TableCell>
                                {profile.city}, {profile.state}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={profile.verified ? "default" : "secondary"}
                                  className={profile.verified ? "" : "bg-[#F0F8F5] text-foreground"}
                                >
                                  {profile.verified ? t.profiles.verified : t.profiles.pending}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-2">
                                  <ProfileActionMenu
                                    userRole={user?.role}
                                    onEdit={() => handleEdit(profile)}
                                    onDelete={() => handleDelete(profile)}
                                    onShare={() => handleShare(profile)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {t.profiles.showing} {startIndex + 1}-{Math.min(endIndex, filteredProfiles.length)} {t.profiles.of} {filteredProfiles.length}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-xs sm:text-sm px-2">
                            {currentPage} / {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <ProfileDetailsModal
        open={!!selectedProfile}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProfile(null);
          }
        }}
        profileId={(selectedProfile as any)?.id ?? (selectedProfile as any)?._id ?? null}
        initialProfile={selectedProfile ?? undefined}
      />

      {/* Share Profile Modal */}
      <ShareProfileModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        onConfirm={handleShareConfirm}
        profileName={profileToShare?.name}
        profileId={(profileToShare as any)?._id ?? profileToShare?.id}
      />
    </div>
  );
}