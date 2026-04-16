import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, X, Camera } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { getProfile } from "@/services/api/profile.api";
/* removed carousel import */

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string | null | undefined;
  mode?: "view" | "pending";
  onVerify?: () => Promise<void> | void;
  initialProfile?: AnyProfile;
};

type AnyProfile = Record<string, any> | null;

const formatDisplayValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : null;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.raw === "string") {
      const trimmedRaw = record.raw.trim();
      if (trimmedRaw.length > 0) return trimmedRaw;
    }
    if (typeof record.value === "string") {
      const trimmedValue = record.value.trim();
      if (trimmedValue.length > 0) return trimmedValue;
    }
    if (typeof record.value === "number") {
      return Number.isFinite(record.value) ? String(record.value) : null;
    }
  }
  return null;
};

export function ProfileDetailsModal({ open, onOpenChange, profileId, mode = "view", onVerify, initialProfile }: Props) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AnyProfile>(null);
  const [error, setError] = useState<string | null>(null);
  // NEW: track external carousel controls and index to place thumbnails after tags
  // removed carousel controls and index
  const [heroLoaded, setHeroLoaded] = useState(false);
  // Add: active hero index to switch between up to 5 photos via thumbnails
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected photo and loader whenever the modal/profile changes
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setError(null);
    }
  }, [initialProfile]);

  // Fetch details by id whenever the modal opens with a valid id
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!open) {
        if (!initialProfile) {
          setProfile(null);
        }
        setError(null);
        setLoading(false);
        return;
      }

      const initialProfileId =
        (initialProfile as any)?._id ?? (initialProfile as any)?.id ?? null;

      if (initialProfile && (!profileId || String(initialProfileId) === String(profileId))) {
        setProfile(initialProfile);
        setError(null);
        setLoading(false);
        return;
      }

      if (!profileId) {
        if (!initialProfile) {
          setProfile(null);
        }
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res: any = await getProfile(String(profileId));
        const data = res?.profile ?? res ?? null;
        if (!cancelled && data) {
          setProfile(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load profile");
          if (!initialProfile) {
            setProfile(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [open, profileId, initialProfile]);

  // Derive photo urls from common keys and normalize to array of strings (max 5)
  const photoUrls: string[] = useMemo(() => {
    const urls: string[] = [];
    const pushUrl = (u: unknown) => {
      if (typeof u === "string" && u.trim()) urls.push(u.trim());
    };
    const maybeArray = (val: unknown) => {
      if (Array.isArray(val)) (val as unknown[]).forEach(pushUrl);
      else pushUrl(val);
    };
    if (profile) {
      maybeArray(profile.photos);
      maybeArray(profile.mediaFiles);
      maybeArray(profile.images);
      maybeArray(profile.profilePhoto);
      maybeArray(profile.avatar);
      // unique, cap 5
      const unique: string[] = Array.from(new Set(urls));
      return unique.slice(0, 5);
    }
    return [];
  }, [profile]);

const hasAny = (obj: AnyProfile, keys: string[]): boolean =>
  !!obj &&
  keys.some((k) => {
    const value = obj[k];
    if (formatDisplayValue(value)) {
      return true;
    }
    return value !== null && value !== undefined && String(value).trim() !== "";
  });

  const contactExists = useMemo(
    () => hasAny(profile, ["phone", "email", "city", "state"]),
    [profile]
  );
  const professionalExists = useMemo(
    () => hasAny(profile, ["education", "occupation", "income"]),
    [profile]
  );
  const familyExists = useMemo(
    () => hasAny(profile, ["fatherName", "motherName", "siblings"]),
    [profile]
  );
  const lifestyleExists = useMemo(
    () => hasAny(profile, ["foodHabit", "drink", "smoke", "hobbies"]),
    [profile]
  );

  const Content = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          {/* Photo skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-56 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-14 w-10 rounded-md" />
              <Skeleton className="h-14 w-10 rounded-md" />
              <Skeleton className="h-14 w-10 rounded-md" />
            </div>
          </div>

          {/* Key details skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Personal info skeleton (replacing <PersonalSkeleton />) */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-56" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-44" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-destructive">{error}</p>;
    }

    if (!profile) {
      return (
        <p className="text-sm text-muted-foreground">
          {t.dashboard.noProfilesYet}
        </p>
      );
    }

    // Key detail badges: Age, Height, City, Religion, Caste
    const keyBadges: Array<string> = [];
    const heightDisplay = formatDisplayValue(profile.height);
    const incomeDisplay = formatDisplayValue(profile.income);
    if (profile.age) keyBadges.push(`${profile.age} ${t.profiles.years}`);
    if (heightDisplay) keyBadges.push(heightDisplay);
    if (profile.city) keyBadges.push(String(profile.city));
    if (profile.religion) keyBadges.push(String(profile.religion));
    if (profile.caste) keyBadges.push(String(profile.caste));

    return (
      <div className="space-y-4">
        {/* Photos Section */}
        <div className="space-y-3">
          <div className="border rounded-xl mb-[15px] p-2 bg-white">
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl shadow-sm bg-white max-h-[60vh] flex items-center justify-center">
              {photoUrls.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center border border-dashed text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-6 w-6 opacity-70" />
                    <span className="text-xs">No photos yet</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={photoUrls[selectedIndex]}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=Profile&background=E5E7EB&color=111827&size=512";
                    }}
                    onLoad={() => setHeroLoaded(true)}
                    className="absolute inset-0 h-full w-full object-contain"
                    style={{
                      opacity: heroLoaded ? 1 : 0,
                      transition: "opacity 200ms ease",
                      backfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                      willChange: "opacity",
                    }}
                    alt={
                      profile?.name
                        ? `${profile.name} Photo ${selectedIndex + 1}`
                        : "Profile Photo"
                    }
                    decoding="async"
                    loading="eager"
                    draggable={false}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity",
                      heroLoaded ? "opacity-0" : "opacity-100"
                    )}
                    aria-hidden="true"
                  >
                    <Skeleton className="h-full w-full" />
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails (show up to 5) */}
            {photoUrls.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto px-1 py-2 bg-white rounded-lg">
                {photoUrls.slice(0, 5).map((src, i) => (
                  <button
                    key={`thumb_${src}_${i}`}
                    type="button"
                    onClick={() => {
                      setHeroLoaded(false);
                      setSelectedIndex(i);
                    }}
                    className={cn(
                      "shrink-0 h-14 w-14 md:h-16 md:w-16 rounded-md overflow-hidden border",
                      i === selectedIndex ? "ring-2 ring-primary" : "opacity-90 hover:opacity-100"
                    )}
                    aria-label={`Thumbnail ${i + 1}`}
                    aria-current={i === selectedIndex ? "true" : "false"}
                  >
                    <img
                      src={src}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=Profile&background=E5E7EB&color=111827&size=512";
                      }}
                      className="h-full w-full object-cover"
                      alt={`Thumbnail ${i + 1}`}
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NEW: Key Badges (centered, single-row, horizontal scroll, blur + shadow) */}
        {keyBadges.length > 0 && (
          <div className="w-full">
            <div className="mx-auto max-w-full px-4">
              {/* Highlight the tags bar */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 rounded-full shadow-sm border min-h-[40px] bg-primary/5 ring-1 ring-primary/10">
                {keyBadges.map((txt, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-full text-xs py-1 px-2 shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors"
                  >
                    {txt}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {hasAny(profile, [
          "name",
          "age",
          "gender",
          "height",
          "maritalStatus",
          "religion",
          "caste",
        ]) && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.profiles.personalInformation}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {hasAny(profile, ["name"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.fullName}
                  </p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              )}
              {hasAny(profile, ["age"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.age}
                  </p>
                  <p className="font-medium">
                    {profile.age} {t.profiles.years}
                  </p>
                </div>
              )}
              {hasAny(profile, ["gender"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.gender}
                  </p>
                  <p className="font-medium capitalize">{profile.gender}</p>
                </div>
              )}
              {hasAny(profile, ["height"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.height}
                  </p>
                  <p className="font-medium">{heightDisplay ?? "-"}</p>
                </div>
              )}
              {hasAny(profile, ["maritalStatus"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.maritalStatus}
                  </p>
                  <p className="font-medium capitalize">
                    {profile.maritalStatus}
                  </p>
                </div>
              )}
              {hasAny(profile, ["religion"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.religion}
                  </p>
                  <p className="font-medium">{profile.religion}</p>
                </div>
              )}
              {hasAny(profile, ["caste"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.caste}
                  </p>
                  <p className="font-medium">{profile.caste}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {contactExists && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.profiles.contactInformation}
            </h3>
            <div className="space-y-3">
              {hasAny(profile, ["phone"]) && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {hasAny(profile, ["email"]) && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              )}
              {hasAny(profile, ["city"]) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {profile.city}
                    {profile.state ? `, ${profile.state}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Information */}
        {professionalExists && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.profiles.professionalInformation}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {hasAny(profile, ["education"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.education}
                  </p>
                  <p className="font-medium">{profile.education}</p>
                </div>
              )}
              {hasAny(profile, ["occupation"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.occupation}
                  </p>
                  <p className="font-medium">{profile.occupation}</p>
                </div>
              )}
              {hasAny(profile, ["income"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.income}
                  </p>
                  <p className="font-medium">{incomeDisplay ?? "-"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Family Information */}
        {familyExists && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.profiles.familyInformation}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {hasAny(profile, ["fatherName"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.fatherName}
                  </p>
                  <p className="font-medium">{profile.fatherName}</p>
                </div>
              )}
              {hasAny(profile, ["motherName"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.motherName}
                  </p>
                  <p className="font-medium">{profile.motherName}</p>
                </div>
              )}
              {hasAny(profile, ["siblings"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profiles.siblings}
                  </p>
                  <p className="font-medium">{profile.siblings}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle & Interests */}
        {lifestyleExists && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.addProfile.lifestyleInterests}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {hasAny(profile, ["foodHabit"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.addProfile.foodHabit}
                  </p>
                  <p className="font-medium capitalize">{profile.foodHabit}</p>
                </div>
              )}
              {hasAny(profile, ["drink"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.addProfile.drink}
                  </p>
                  <p className="font-medium capitalize">{profile.drink}</p>
                </div>
              )}
              {hasAny(profile, ["smoke"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.addProfile.smoke}
                  </p>
                  <p className="font-medium capitalize">{profile.smoke}</p>
                </div>
              )}
              {hasAny(profile, ["hobbies"]) && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.addProfile.hobbies}
                  </p>
                  <p className="font-medium">{profile.hobbies}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expectations */}
        {hasAny(profile, ["expectations"]) && (
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t.profiles.expectations}
            </h3>
            <p className="text-sm">{profile.expectations}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-3 sm:p-4 max-w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border-border/50 bg-white shadow-xl"
        showCloseButton={false}
      >
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <DialogTitle className="text-base sm:text-lg font-bold truncate">
                {(profile?.name && String(profile.name)) || t.profiles.profileDetails}
              </DialogTitle>
              {profile && (
                <Badge
                  variant={profile.verified || profile.status?.toLowerCase() === "active" ? "default" : "secondary"}
                  className={cn("shrink-0", !(profile.verified || profile.status?.toLowerCase() === "active") && "bg-[#F0F8F5] text-foreground")}
                >
                  {profile.verified || profile.status?.toLowerCase() === "active" ? t.profiles.verified : t.profiles.pending}
                </Badge>
              )}
            </div>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent/60"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDetailsModal;