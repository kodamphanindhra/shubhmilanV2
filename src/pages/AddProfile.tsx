import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAddProfile } from "@/hooks/useAddProfile";
import { StepIndicator } from "@/components/add-profile/StepIndicator";
import { FormNavigation } from "@/components/add-profile/FormNavigation";
import { Step1BasicDetails } from "@/components/add-profile/steps/Step1BasicDetails";
import { Step2ReligionCulture } from "@/components/add-profile/steps/Step2ReligionCulture";
import { Step3LocationCareer } from "@/components/add-profile/steps/Step3LocationCareer";
import { Step4FamilyBackground } from "@/components/add-profile/steps/Step4FamilyBackground";
import { Step5LifestyleInterests } from "@/components/add-profile/steps/Step5LifestyleInterests";
import { Step6HoroscopeDetails } from "@/components/add-profile/steps/Step6HoroscopeDetails";
import { Step7PartnerPreferences } from "@/components/add-profile/steps/Step7PartnerPreferences";
import { Step8PhotosMedia } from "@/components/add-profile/steps/Step8PhotosMedia";
import { UnsavedChangesModal } from "@/components/add-profile/UnsavedChangesModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicForm } from "@/components/add-profile/BasicForm";
import { ProfileDataProvider } from "@/context/ProfileDataContext";
import { ImageUploadCard } from "@/components/add-profile/ImageUploadCard";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Link as LinkIcon, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Religion & Culture" },
  { id: 3, title: "Location & Career" },
  { id: 4, title: "Family Background" },
  { id: 5, title: "Lifestyle & Interests" },
  { id: 6, title: "Horoscope Details" },
  { id: 7, title: "Partner Preferences" },
  { id: 8, title: "Photos & Media" },
];

function AddProfileContent({ publicMode = false, publicToken }: { publicMode?: boolean; publicToken?: string }) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [formMode, setFormMode] = useState<"basic" | "detailed">("detailed");
  const [nowTs, setNowTs] = useState<number>(Date.now());
  const [shareOpen, setShareOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Replace: use tokens list + generation, move UI into a modal
  // Remove: publicSettings usage
  // Add: active tokens query and modal states
  const tokens = useQuery(api.settings.listActivePublicFormTokens);
  const generateEphemeral = useMutation(api.settings.generateEphemeralPublicFormToken);
  const revokeToken = useMutation(api.settings.revokePublicFormToken);

  // Add: derive active tokens once for UI and counts
  const activeTokens = (tokens || []).filter((t) => t.expiresAt > nowTs);

  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 30000); // update every 30s
    return () => clearInterval(id);
  }, []);

  // Helper: format time left for a token
  const fmtTimeLeft = (expiresAt?: number | null) => {
    if (!expiresAt) return "";
    const diff = Math.max(0, expiresAt - nowTs);
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hrs <= 0 && mins <= 0) return "Expired";
    if (hrs <= 0) return `${mins}m left`;
    return `${hrs}h ${mins}m left`;
  };

  const makeLink = (token: string) => `${window.location.origin}/add-profile/${token}`;

  const copyAny = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const onGenerateLink = async () => {
    try {
      await generateEphemeral({});
      toast.success("24-hour link generated");
    } catch {
      toast.error("Failed to generate link");
    }
  };

  const copyLink = async () => {
    if (!selectedToken) return;
    try {
      await navigator.clipboard.writeText(makeLink(selectedToken));
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const onRevokeLink = async (token: string) => {
    const ok = window.confirm("Remove this link? It will stop working immediately.");
    if (!ok) return;
    try {
      await revokeToken({ token });
      toast.success("Link removed");
    } catch (e) {
      toast.error("Failed to remove link");
    }
  };

  const {
    formData,
    errors,
    isLoading,
    isDirty,
    showUnsavedModal,
    currentStep,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSubmitBasic,
    handleCancel,
    confirmLeave,
    cancelLeave,
    handleNextStep,
    handlePreviousStep,
    handleStepClick,
    handleSaveDraft,
    dropdownData,
  } = useAddProfile(publicMode ? { publicToken, onSuccessRedirect: "/thank-you" } : undefined);

  useEffect(() => {
    document.title = `${t.nav.addProfile} - ${t.landing.appName}`;
  }, [t]);

  return (
    <div className="min-h-screen h-screen flex bg-background">
      {!publicMode && <Sidebar />}

      <div className="flex-1 h-screen overflow-y-auto">
        {isMobile && <div className="h-16" />}

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-between"
          >
            <h1 className="text-3xl font-bold">{t.addProfile.title}</h1>

            {/* Open modal to manage/share links */}
            {!publicMode && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShareOpen(true)}
                  variant="default"
                  className="gap-2 shadow-lg ring-1 ring-primary/20"
                >
                  <LinkIcon className="h-4 w-4" />
                  Generate 24h Share Link
                </Button>
              </div>
            )}
          </motion.div>

          {/* Share Links Modal: generate + list active tokens with QR */}
          {!publicMode && (
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogContent className="max-w-lg rounded-2xl shadow-xl pt-12">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Public Add Profile Links</span>
                    <Badge variant="secondary" className="ml-2">{`Active: ${activeTokens.length}`}</Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Generate a new 24-hour link and share it. Active links are listed below and disappear when expired.
                      This list refreshes every 30s.
                    </p>
                    <Button onClick={onGenerateLink} className="gap-2 shadow ring-1 ring-primary/20">
                      <LinkIcon className="h-4 w-4" />
                      Generate 24h Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {activeTokens.length === 0 ? (
                      <div className="rounded-lg border p-6 text-center space-y-3 bg-muted/30">
                        <QrCode className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No active links yet.</p>
                        <Button onClick={onGenerateLink} className="gap-2">
                          <LinkIcon className="h-4 w-4" />
                          Generate 24h Link
                        </Button>
                      </div>
                    ) : (
                      activeTokens
                        .sort((a, b) => a.expiresAt - b.expiresAt)
                        .map((t) => {
                          const link = makeLink(t.token);
                          const timeLeft = fmtTimeLeft(t.expiresAt);
                          const qrUrl = `https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=${encodeURIComponent(
                            link
                          )}&choe=UTF-8`;
                          return (
                            <div key={t.token} className="rounded-lg border p-3 bg-card">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">{`Expires in ${timeLeft}`}</Badge>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <Input readOnly value={link} />
                                <Button variant="outline" onClick={() => copyAny(link)} title="Copy Link">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedToken(t.token);
                                    setQrOpen(true);
                                  }}
                                  className="gap-2"
                                >
                                  <QrCode className="h-4 w-4" />
                                  QR
                                </Button>
                                <Button variant="ghost" asChild>
                                  <a href={link} target="_blank" rel="noreferrer" className="gap-2 inline-flex items-center">
                                    <LinkIcon className="h-4 w-4" />
                                    Open
                                  </a>
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => onRevokeLink(t.token)}
                                  className="gap-2"
                                  title="Remove this link"
                                  aria-label="Remove link"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* QR Dialog per token */}
                              <Dialog open={qrOpen && selectedToken === t.token} onOpenChange={setQrOpen}>
                                <DialogContent className="max-w-sm rounded-xl pt-12">
                                  <DialogHeader>
                                    <DialogTitle>Scan to open profile submission form</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center gap-4">
                                    <div className="bg-white p-3 rounded-xl shadow">
                                      <img
                                        src={qrUrl}
                                        alt="Public form QR"
                                        className="h-56 w-56 rounded-lg"
                                        draggable={false}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button onClick={() => copyAny(link)} className="gap-2">
                                        <Copy className="h-4 w-4" />
                                        Copy Link
                                      </Button>
                                      <Button variant="outline" asChild>
                                        <a href={link} target="_blank" rel="noreferrer" className="gap-2 inline-flex items-center">
                                          <LinkIcon className="h-4 w-4" />
                                          Open
                                        </a>
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                      Link expires in {fmtTimeLeft(t.expiresAt)}.
                                    </p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Form Mode Toggle */}
          <div className="mb-6">
            <Tabs value={formMode} onValueChange={(value) => setFormMode(value as "basic" | "detailed")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Form</TabsTrigger>
                <TabsTrigger value="detailed">Step Form</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Conditional Rendering Based on Form Mode */}
          {formMode === "basic" ? (
            <BasicForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmitBasic}
              onCancel={publicMode ? (() => {}) : handleCancel}
            />
          ) : (
            <div>
              {/* Step Indicator */}
              <StepIndicator
                currentStep={currentStep}
                totalSteps={STEPS.length}
                steps={STEPS}
                onStepClick={handleStepClick}
              />

              {/* Form Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    {STEPS[currentStep - 1].title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> indicates required fields
                  </p>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentStep === 1 && (
                        <Step1BasicDetails
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )}
                      {currentStep === 2 && (
                        <Step2ReligionCulture
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            religions: dropdownData.religions,
                            castes: dropdownData.castes,
                            gothras: dropdownData.gothras,
                            motherTongues: dropdownData.motherTongues,
                          }}
                        />
                      )}
                      {currentStep === 3 && (
                        <Step3LocationCareer
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            cities: dropdownData.cities,
                            states: dropdownData.states,
                            educationLevels: dropdownData.educationLevels,
                            professions: dropdownData.professions,
                          }}
                        />
                      )}
                      {currentStep === 4 && (
                        <Step4FamilyBackground
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            familyTypes: dropdownData.familyTypes,
                          }}
                        />
                      )}
                      {currentStep === 5 && (
                        <Step5LifestyleInterests
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            foodHabits: dropdownData.foodHabits,
                            drinkingHabits: dropdownData.drinkingHabits,
                            smokingHabits: dropdownData.smokingHabits,
                            hobbies: dropdownData.hobbies,
                          }}
                        />
                      )}
                      {currentStep === 6 && (
                        <Step6HoroscopeDetails
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            nadis: dropdownData.nadis,
                          }}
                        />
                      )}
                      {currentStep === 7 && (
                        <Step7PartnerPreferences
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          dropdownData={{
                            religions: dropdownData.religions,
                            castes: dropdownData.castes,
                            educationLevels: dropdownData.educationLevels,
                            foodHabits: dropdownData.foodHabits,
                            drinkingHabits: dropdownData.drinkingHabits,
                            smokingHabits: dropdownData.smokingHabits,
                          }}
                        />
                      )}
                      {currentStep === 8 && (
                        <Step8PhotosMedia
                          formData={formData}
                          errors={errors}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <FormNavigation
                    currentStep={currentStep}
                    totalSteps={STEPS.length}
                    isLoading={isLoading}
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    onSaveDraft={publicMode ? (() => {}) : handleSaveDraft}
                    onSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {!publicMode && (
        <UnsavedChangesModal
          open={showUnsavedModal}
          onConfirm={confirmLeave}
          onCancel={cancelLeave}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Creating profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddProfile() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.nav.addProfile} - ${t.landing.appName}`;
  }, [t]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProfileDataProvider>
      <AddProfileContent />
    </ProfileDataProvider>
  );
}

export { AddProfileContent };