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
  // Removed: public form link/token/QR state


  // Convex features removed: tokens, generateEphemeral, revokeToken, activeTokens
  // If you need public form links, implement with your REST API or remove related UI.

  // Removed: interval for token expiry refresh

  // Removed: all helpers for public form links/tokens/QR

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
          </motion.div>

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