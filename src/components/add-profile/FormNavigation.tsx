import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  isLoading,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
}: FormNavigationProps) {
  const { t } = useI18n();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
      {/* Previous Button */}
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      )}

      {/* Save Draft Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={onSaveDraft}
        disabled={isLoading}
        className="w-full sm:w-auto order-3 sm:order-2 sm:ml-auto"
      >
        <Save className="h-4 w-4 mr-2" />
        Save as Draft
      </Button>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto order-1 sm:order-3"
        >
          {isLoading ? (
            <>Submitting...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Profile
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="w-full sm:w-auto order-1 sm:order-3"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
