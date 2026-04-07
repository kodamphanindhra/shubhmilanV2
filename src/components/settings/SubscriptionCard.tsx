import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/types/settings";
import { useI18n } from "@/hooks/use-i18n";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isActive?: boolean;
  onPurchase: (planId: string) => void;
  isLoading?: boolean;
}

export function SubscriptionCard({
  plan,
  isActive = false,
  onPurchase,
  isLoading = false,
}: SubscriptionCardProps) {
  const { t } = useI18n();

  const getPriceDisplay = () => {
    if (plan.price === 0) {
      return t.settings.free;
    }
    const period = plan.duration.toLowerCase().includes("month")
      ? t.settings.perMonth
      : t.settings.perYear;
    return `₹${plan.price} ${period}`;
  };

  return (
    <Card className={isActive ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <CardDescription>{plan.duration}</CardDescription>
          </div>
          {isActive && (
            <Badge variant="default">{t.settings.activePlan}</Badge>
          )}
        </div>
        <div className="pt-4">
          <p className="text-3xl font-bold">{getPriceDisplay()}</p>
        </div>
      </CardHeader>
      <CardContent>
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium">{t.settings.features}:</p>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          className="w-full"
          variant={isActive ? "outline" : "default"}
          disabled={isActive || isLoading}
          onClick={() => onPurchase(plan.id)}
        >
          {isActive ? t.settings.activePlan : t.settings.purchasePlan}
        </Button>
      </CardContent>
    </Card>
  );
}
