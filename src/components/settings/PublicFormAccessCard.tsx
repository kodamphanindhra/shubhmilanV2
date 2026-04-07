import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Share2, QrCode, Copy, RefreshCw, Link as LinkIcon, Mail, MessageSquareText, Phone, Download, Printer } from "lucide-react";


export function PublicFormAccessCard() {
  const profile = useQuery(api.settings.getUserProfile);
  const publicSettings = useQuery(api.settings.getPublicFormSettings);
  const setEnabled = useMutation(api.settings.setPublicFormEnabled);
  const regenToken = useMutation(api.settings.regeneratePublicFormToken);

  const [qrOpen, setQrOpen] = useState(false);

  const link = useMemo(() => {
    if (!publicSettings?.token) return "";
    return `${window.location.origin}/add-profile/${publicSettings.token}`;
  }, [publicSettings?.token]);

  const qrUrl = useMemo(() => {
    if (!link) return "";
    const encoded = encodeURIComponent(link);
    return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encoded}&choe=UTF-8`;
  }, [link]);

  const handleToggle = async (checked: boolean) => {
    try {
      await setEnabled({ enabled: checked });
      toast.success(checked ? "Public form enabled" : "Public form disabled");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenToken({});
      toast.success("Link regenerated");
    } catch {
      toast.error("Failed to regenerate");
    }
  };

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  const systemShare = async () => {
    if (!link) return;
    const data = {
      title: "ShubhMilan - Profile Submission",
      text: "Open this link to submit a profile:",
      url: link,
    };
    if ((navigator as any).share) {
      try {
        await (navigator as any).share(data);
      } catch {}
    } else {
      await copyLink();
    }
  };

  const shareWhatsApp = () => {
    if (!link) return;
    const href = `https://wa.me/?text=${encodeURIComponent(`Submit a profile using this link:\n${link}`)}`;
    window.open(href, "_blank");
  };

  const shareSMS = () => {
    if (!link) return;
    const href = `sms:?body=${encodeURIComponent(`Submit a profile using this link: ${link}`)}`;
    window.location.href = href;
  };

  const shareEmail = () => {
    if (!link) return;
    const subject = encodeURIComponent("ShubhMilan - Profile Submission Link");
    const body = encodeURIComponent(`Hello,\n\nUse the link below to submit a profile:\n${link}\n\nThanks.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const downloadQr = async () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "public-form-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const printQr = () => {
    if (!qrUrl) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Public Form QR</title></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fff;"><img src="${qrUrl}" style="border-radius:16px" /></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const enabled = !!publicSettings?.enabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Add Profile Form Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enable Public Form</Label>
            <p className="text-xs text-muted-foreground">Allow others to submit profiles using your link or QR.</p>
          </div>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>

        <div className="grid gap-2">
          <Label>Public Form Link</Label>
          <div className="flex gap-2">
            <Input value={link} readOnly placeholder="Enable to generate link" />
            <Button variant="outline" onClick={copyLink} disabled={!link} title="Copy Link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={systemShare} disabled={!link} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={shareWhatsApp} disabled={!link} className="gap-2">
            <MessageSquareText className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={shareSMS} disabled={!link} className="gap-2">
            <Phone className="h-4 w-4" />
            SMS
          </Button>
          <Button variant="outline" onClick={shareEmail} disabled={!link} className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="secondary" onClick={() => setQrOpen(true)} disabled={!link} className="gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </Button>
          <Button variant="ghost" onClick={handleRegenerate} disabled={!enabled} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate Link
          </Button>
          <Button variant="ghost" asChild>
            <a href={link || "#"} onClick={(e) => !link && e.preventDefault()} className="gap-2 inline-flex items-center">
              <LinkIcon className="h-4 w-4" />
              Open
            </a>
          </Button>
        </div>

        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Scan to open profile submission form</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-xl shadow">
                {qrUrl ? (
                  <img src={qrUrl} alt="Public form QR" className="h-64 w-64 rounded-lg" />
                ) : (
                  <div className="h-64 w-64 rounded-lg bg-muted" />
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadQr} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={printQr} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                “Scan this QR to open the profile submission form.”
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
