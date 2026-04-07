import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useConnectSupport } from "@/hooks/useConnectSupport";
import { useI18n } from "@/hooks/use-i18n";
import { Loader2 } from "lucide-react";

interface ConnectSupportFormProps {
  userName: string;
  userEmail: string;
  userRole: string;
}

export function ConnectSupportForm({ userName, userEmail, userRole }: ConnectSupportFormProps) {
  const { t } = useI18n();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleClear } = useConnectSupport({
    name: userName,
    email: userEmail,
    role: userRole
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.support?.formTitle || "Submit Support Request"}</CardTitle>
        <CardDescription>{t.support?.formDescription || "Fill out the form below and we'll get back to you as soon as possible"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.support?.name || "Name"} <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t.support?.namePlaceholder || "Enter your name"}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.support?.email || "Email"}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </div>

          {/* Role and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t.support?.role || "Role"}</Label>
              <Input
                id="role"
                value={formData.role}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t.support?.category || "Issue Category"} <span className="text-destructive">*</span></Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category" className="w-full" aria-invalid={!!errors.category}>
                  <SelectValue placeholder={t.support?.categoryPlaceholder || "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">{t.support?.categoryTechnical || "Technical Issue"}</SelectItem>
                  <SelectItem value="billing">{t.support?.categoryBilling || "Billing Question"}</SelectItem>
                  <SelectItem value="feature">{t.support?.categoryFeature || "Feature Request"}</SelectItem>
                  <SelectItem value="account">{t.support?.categoryAccount || "Account Help"}</SelectItem>
                  <SelectItem value="other">{t.support?.categoryOther || "Other"}</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">{t.support?.subject || "Subject"} <span className="text-destructive">*</span></Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder={t.support?.subjectPlaceholder || "Brief description of your issue"}
              aria-invalid={!!errors.subject}
            />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t.support?.description || "Description"} <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t.support?.descriptionPlaceholder || "Describe your issue in detail..."}
              className="min-h-32"
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">{t.support?.descriptionHelper || "Minimum 10 characters"}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-initial">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.support?.submitButton || "Submit Ticket"}
            </Button>
            <Button type="button" variant="ghost" onClick={handleClear} disabled={isSubmitting}>
              {t.support?.clearButton || "Clear Form"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
