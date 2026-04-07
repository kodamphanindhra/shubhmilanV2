import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: number; title: string }[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      {/* Mobile: Dots */}
      <div className="md:hidden flex justify-center items-center gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => step.id < currentStep && onStepClick?.(step.id)}
            disabled={step.id > currentStep}
            className={cn(
              "h-2 rounded-full transition-all",
              step.id === currentStep && "w-8 bg-primary",
              step.id < currentStep && "w-2 bg-primary cursor-pointer hover:bg-primary/80",
              step.id > currentStep && "w-2 bg-muted"
            )}
            aria-label={`Step ${step.id}: ${step.title}`}
          />
        ))}
      </div>

      {/* Desktop: Full Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => step.id <= currentStep && onStepClick?.(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  step.id < currentStep &&
                    "bg-primary border-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                  step.id === currentStep &&
                    "bg-primary border-primary text-primary-foreground",
                  step.id > currentStep && "bg-background border-muted text-muted-foreground"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all",
                    step.id < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 text-center text-xs transition-all",
                step.id === currentStep && "font-semibold text-foreground",
                step.id !== currentStep && "text-muted-foreground"
              )}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
