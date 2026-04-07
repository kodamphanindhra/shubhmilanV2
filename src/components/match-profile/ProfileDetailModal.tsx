import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileMatch } from "@/types/matchProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ProfileDetailModalProps {
  profile: ProfileMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showContactInfo?: boolean;
  showShareButton?: boolean;
  showCloseButton?: boolean;
}

export function ProfileDetailModal({ profile, open, onOpenChange, showContactInfo = true, showShareButton = true, showCloseButton = true }: ProfileDetailModalProps) {
  const { t } = useI18n();

  const [heroLoaded, setHeroLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeContact, setIncludeContact] = useState(true);
  const [shareConfirmOpen, setShareConfirmOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
    setHeroLoaded(false);
    setShareOpen(false);
    setCopied(false);
    setIncludeContact(true);
  }, [open, profile?.id]);

  const photoUrls = useMemo(() => {
    const urls: string[] = [];
    const push = (u: unknown) => {
      if (typeof u === "string" && u.trim()) urls.push(u.trim());
    };
    const maybeArray = (val: unknown) => {
      if (Array.isArray(val)) (val as unknown[]).forEach(push);
      else push(val);
    };
    if (profile) {
      // Try multiple common keys
      maybeArray((profile as any).photos);
      maybeArray((profile as any).images);
      maybeArray((profile as any).photoUrls);
      maybeArray((profile as any).profilePhoto);
      maybeArray((profile as any).avatar);
    }
    return Array.from(new Set(urls)).slice(0, 5);
  }, [profile]);

  const profileId = (profile as any)?.id ?? (profile as any)?._id ?? "";
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${profileId}?contact=${includeContact ? "1" : "0"}`
      : "";
  const shareText = profile?.name ? `${profile.name} — ${shareUrl}` : shareUrl;

  const handleShareClick = async () => {
    setShareConfirmOpen(true);
  };

  const handleConfirmShare = async (withContact: boolean) => {
    try {
      setIncludeContact(withContact);
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/p/${profileId}?contact=${withContact ? "1" : "0"}`
          : "";
      const text = profile?.name ? `${profile.name} — ${url}` : url;

      if (typeof navigator !== "undefined" && "share" in navigator && url) {
        await (navigator as any).share({
          title: "ShubhMilan Profile",
          text,
          url,
        });
      } else {
        // Fallback to inline share panel
        setShareOpen(true);
      }
    } catch {
      // If system share fails, show inline panel
      setShareOpen(true);
    } finally {
      setShareConfirmOpen(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.profiles.profileDetails}</DialogTitle>
        </DialogHeader>

        {showShareButton && (
          <div className="flex items-center justify-end">
            <Button variant="outline" size="sm" onClick={handleShareClick} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        )}

        {showShareButton && (
          <AlertDialog open={shareConfirmOpen} onOpenChange={setShareConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Share Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  Include contact information in the shared link?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleConfirmShare(true)} className="w-full">
                  Share with Contact
                </Button>
                <Button variant="secondary" onClick={() => handleConfirmShare(false)} className="w-full">
                  Share without Contact
                </Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showShareButton && shareOpen && (
          <div className="mt-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="include-contact" className="text-sm">Include contact info</Label>
                  <Switch id="include-contact" checked={includeContact} onCheckedChange={setIncludeContact} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Shareable link</span>
              </div>
              <div className="flex items-center gap-2">
                <Input readOnly value={shareUrl} className="flex-1" />
                <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-2">
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Share via WhatsApp
                </a>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => {
                    const text = `${shareText}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text);
                      toast.success("Share text copied");
                    }
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Copy share text
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Photos Section */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl shadow-sm bg-white border">
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
                    alt={profile?.name ? `${profile.name} Photo ${selectedIndex + 1}` : "Profile Photo"}
                    decoding="async"
                    loading="eager"
                    draggable={false}
                  />
                  <div
                    className={cn("absolute inset-0 transition-opacity", heroLoaded ? "opacity-0" : "opacity-100")}
                    aria-hidden="true"
                  >
                    <Skeleton className="h-full w-full" />
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {photoUrls.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto px-1 py-1 rounded-lg">
                {photoUrls.slice(0, 5).map((src: string, i: number) => (
                  <button
                    key={`thumb_${src}_${i}`}
                    type="button"
                    onClick={() => {
                      setHeroLoaded(false);
                      setSelectedIndex(i);
                    }}
                    className={cn(
                      "shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-md overflow-hidden border",
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

          {/* Key Badges (age, height, city, religion, caste) */}
          <div className="w-full">
            <div className="mx-auto max-w-full px-2">
              <div className="flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 rounded-full shadow-sm border min-h-[36px] bg-primary/5 ring-1 ring-primary/10">
                {[
                  profile.age ? `${profile.age} ${t.profiles.years}` : null,
                  (profile as any).height ? String((profile as any).height) : null,
                  profile.city ? String(profile.city) : null,
                  profile.religion ? String(profile.religion) : null,
                  profile.caste ? String(profile.caste) : null,
                ]
                  .filter(Boolean)
                  .map((txt, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="rounded-full text-xs py-1 px-2 shrink-0 bg-primary/10 text-primary border-primary/20"
                    >
                      {txt as string}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="mb-3 font-semibold">{t.profiles.personalInformation}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.fullName}</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.age}</p>
                <p className="font-medium">{profile.age} {t.profiles.years}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.gender}</p>
                <Badge variant={profile.gender === "male" ? "default" : "secondary"}>
                  {profile.gender === "male" ? t.profiles.male : t.profiles.female}
                </Badge>
              </div>
              {profile.height && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.profiles.height}</p>
                  <p className="font-medium">{profile.height}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.maritalStatus}</p>
                <p className="font-medium capitalize">{profile.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.religion}</p>
                <p className="font-medium">{profile.religion}</p>
              </div>
              {profile.caste && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.profiles.caste}</p>
                  <p className="font-medium">{profile.caste}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          {showContactInfo && (
            <div>
              <h3 className="mb-3 font-semibold">{t.profiles.contactInformation}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.settings.email}</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{t.settings.mobile}</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Professional Information */}
          <div>
            <h3 className="mb-3 font-semibold">{t.profiles.professionalInformation}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.education}</p>
                <p className="font-medium">{profile.education}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.occupation}</p>
                <p className="font-medium">{profile.occupation}</p>
              </div>
              {profile.income && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.profiles.income}</p>
                  <p className="font-medium">{profile.income}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t.profiles.location}</p>
                <p className="font-medium">{profile.city}, {profile.state}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}