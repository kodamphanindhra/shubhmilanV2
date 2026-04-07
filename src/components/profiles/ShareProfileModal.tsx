import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ShareProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (action: "with-contact" | "without-contact" | "cancel") => void;
  profileName?: string;
  profileId?: string | null;
}

export function ShareProfileModal({
  open,
  onOpenChange,
  onConfirm,
  profileName,
  profileId,
}: ShareProfileModalProps) {
  const [step, setStep] = useState<"choose" | "link">("choose");
  const [includeContact, setIncludeContact] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setStep("choose");
      setIncludeContact(true);
      setCopied(false);
    }
  }, [open]);

  const shareUrl = useMemo(() => {
    if (!profileId || typeof window === "undefined") return "";
    const origin = window.location.origin;
    const contactParam = includeContact ? "1" : "0";
    return `${origin}/p/${profileId}?contact=${contactParam}`;
  }, [profileId, includeContact]);

  const handleChoose = (action: "with-contact" | "without-contact" | "cancel") => {
    if (action === "cancel") {
      onConfirm(action);
      onOpenChange(false);
      return;
    }
    const withContact = action === "with-contact";
    setIncludeContact(withContact);
    onConfirm(action);
    // Move to link step instead of closing
    setStep("link");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          {step === "choose" ? (
            <DialogDescription>
              Do you want to share {profileName ? `${profileName}'s` : "this"} profile's contact details?
            </DialogDescription>
          ) : (
            <DialogDescription>
              Share this link with others. You can copy it or share via WhatsApp.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "choose" ? (
          <DialogFooter className="flex-col sm:flex-col gap-2 sm:gap-2">
            <Button onClick={() => handleChoose("with-contact")} className="w-full">
              Share With Contact Details
            </Button>
            <Button onClick={() => handleChoose("without-contact")} variant="outline" className="w-full">
              Share Without Contact Details
            </Button>
            <Button onClick={() => handleChoose("cancel")} variant="ghost" className="w-full">
              Cancel
            </Button>
          </DialogFooter>
        ) : (
          <div className="flex flex-col gap-3">
            {!profileId ? (
              <p className="text-sm text-destructive">Cannot generate share link: missing profile id.</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${profileName ? `${profileName} — ` : ""}${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Share via WhatsApp
                  </a>
                </div>
                <DialogFooter className="mt-2">
                  <Button variant="outline" onClick={() => setStep("choose")}>
                    Back
                  </Button>
                  <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}