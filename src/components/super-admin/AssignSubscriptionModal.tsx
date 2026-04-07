import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperAdminUser, SubscriptionFormData } from "@/types/superAdmin";
import { MOCK_SUBSCRIPTION_PLANS } from "@/mockData/settings";
import { useI18n } from "@/hooks/use-i18n";

interface AssignSubscriptionModalProps {
  user: SuperAdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (userId: string, data: SubscriptionFormData) => void;
}

export function AssignSubscriptionModal({ user, open, onOpenChange, onAssign }: AssignSubscriptionModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        planId: user.subscription?.planId || "",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [user]);

  const selectedPlan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === formData.planId);

  const calculateEndDate = () => {
    if (!selectedPlan || !formData.startDate) return "-";
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);

    if (selectedPlan.type === "Trial" || selectedPlan.type === "Onboarding") {
      endDate.setDate(endDate.getDate() + 30);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return endDate.toISOString().split("T")[0];
  };

  const handleAssign = () => {
    if (!user || !formData.planId) return;
    onAssign(user.id, formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.superAdmin.assignSubscription}</DialogTitle>
          <DialogDescription>{t.superAdmin.assignSubscriptionDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan">{t.superAdmin.subscriptionPlan}</Label>
            <Select
              value={formData.planId}
              onValueChange={(value) => setFormData({ ...formData, planId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.superAdmin.selectPlan} />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SUBSCRIPTION_PLANS.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.price} ({plan.duration})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">{t.superAdmin.startDate}</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.superAdmin.endDate}</Label>
            <div className="rounded-md border bg-muted px-3 py-2 text-sm">
              {calculateEndDate()}
            </div>
          </div>

          {selectedPlan && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="font-medium">{selectedPlan.name}</div>
              <div className="text-sm text-muted-foreground">
                ₹{selectedPlan.price} - {selectedPlan.duration}
              </div>
              {selectedPlan.features && (
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.actions.cancel}
          </Button>
          <Button onClick={handleAssign} disabled={!formData.planId}>
            {t.superAdmin.assign}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
