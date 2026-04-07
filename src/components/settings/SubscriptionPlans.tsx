import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MOCK_SUBSCRIPTION_PLANS, MOCK_USER_PROFILE } from "@/mockData/settings";
import { SubscriptionCard } from "./SubscriptionCard";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";

export function SubscriptionPlans() {
  const { t } = useI18n();
  const userProfile = useQuery(api.settings.getUserProfile);
  const purchasePlan = useMutation(api.settings.purchasePlan);
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data as fallback
  const profile = userProfile || MOCK_USER_PROFILE;
  const plans = MOCK_SUBSCRIPTION_PLANS;

  const handlePurchase = async (planId: string) => {
    setIsLoading(true);
    try {
      await purchasePlan({ planId });
      toast.success(t.toast.planPurchased);
    } catch (error) {
      toast.error(t.toast.planPurchaseFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {profile?.subscription?.isActive ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.currentPlan}</CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan:</span>
                <span className="text-sm">
                  {plans.find(p => p.id === profile.subscription?.planId)?.name || profile.subscription?.planId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.settings.startDate}:</span>
                <span className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(profile.subscription.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.settings.expiryDate}:</span>
                <span className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(profile.subscription.endDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.noActivePlan}</CardTitle>
            <CardDescription>{t.settings.noActivePlanDesc}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{t.settings.subscriptionTitle}</h3>
          <p className="text-sm text-muted-foreground">{t.settings.subscriptionSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isActive={profile?.subscription?.planId === plan.id && profile?.subscription?.isActive}
              onPurchase={handlePurchase}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
