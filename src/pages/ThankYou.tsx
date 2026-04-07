import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPORT_CONTACT_INFO } from "@/mockData/support";
import { useEffect } from "react";
import { useI18n } from "@/hooks/use-i18n";

export default function ThankYou() {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `Thank You - ${t.landing.appName}`;
  }, [t]);

  const whatsappLink = `https://wa.me/${(SUPPORT_CONTACT_INFO.phone || "").replace(/\\D/g, "")}?text=${encodeURIComponent(
    "Hello, I have submitted a profile via the public form and need assistance."
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Your profile is submitted successfully.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Thank you for submitting your details. Our team will review and reach out if needed.
          </p>
          <div className="flex items-center justify-center">
            <Button asChild>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                Contact Support on WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
