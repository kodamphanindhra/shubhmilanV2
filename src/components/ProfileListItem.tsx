import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ProfileListItemProps {
  name: string;
  age?: number;
  gender?: string;
  location: string;
  verified: boolean;
  actionIcon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  verifiedLabel: string;
  pendingLabel: string;
  yearsLabel: string;
  trailingActions?: ReactNode;
}

export function ProfileListItem({
  name,
  age,
  gender,
  location,
  verified,
  onAction,
  verifiedLabel,
  pendingLabel,
  yearsLabel,
  trailingActions,
}: ProfileListItemProps) {
  const details: string[] = [];

  if (typeof age === "number") {
    details.push(`${age} ${yearsLabel}`);
  }

  if (gender) {
    const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
    details.push(normalizedGender);
  }

  const normalizedLocation = location && location.trim().length > 0 ? location : "N/A";
  details.push(normalizedLocation);

  const detailText = details.join(" • ");

  return (
    <div
      className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 cursor-pointer"
      onClick={() => onAction?.()}
    >
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{detailText}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant={verified ? "default" : "secondary"}
          className={`shrink-0 ${verified ? "" : "bg-[#F0F8F5] text-foreground"}`}
        >
          {verified ? verifiedLabel : pendingLabel}
        </Badge>
        {trailingActions && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {trailingActions}
          </div>
        )}
      </div>
    </div>
  );
}