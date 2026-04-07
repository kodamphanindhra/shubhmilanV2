import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { UserFilters as UserFiltersType } from "@/types/superAdmin";
import { useI18n } from "@/hooks/use-i18n";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFilterChange: (filters: UserFiltersType) => void;
  onReset: () => void;
}

export function UserFilters({ filters, onFilterChange, onReset }: UserFiltersProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.superAdmin.searchPlaceholder}
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9 w-full"
          />
        </div>

        {/* Role Filter */}
        <div className="min-w-0 sm:w-48">
          <Select
            value={filters.role}
            onValueChange={(value) => onFilterChange({ ...filters, role: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.superAdmin.allRoles} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.superAdmin.allRoles}</SelectItem>
              <SelectItem value="Broker">{t.superAdmin.broker}</SelectItem>
              <SelectItem value="Admin">{t.superAdmin.admin}</SelectItem>
              <SelectItem value="SuperAdmin">{t.superAdmin.superAdmin}</SelectItem>
              <SelectItem value="Assistant">{t.superAdmin.assistant || "Assistant"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="min-w-0 sm:w-48">
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.superAdmin.allStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.superAdmin.allStatus}</SelectItem>
              <SelectItem value="Active">{t.superAdmin.active}</SelectItem>
              <SelectItem value="Inactive">{t.superAdmin.inactive}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscription Filter */}
        <div className="min-w-0 sm:w-48">
          <Select
            value={filters.subscription}
            onValueChange={(value) => onFilterChange({ ...filters, subscription: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.superAdmin.allSubscriptions} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.superAdmin.allSubscriptions}</SelectItem>
              <SelectItem value="free">{t.superAdmin.freeTrial}</SelectItem>
              <SelectItem value="filter_monthly">{t.superAdmin.matchFilter}</SelectItem>
              <SelectItem value="premium_basic">{t.superAdmin.premiumBasic}</SelectItem>
              <SelectItem value="premium_filter">{t.superAdmin.premiumFilter}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
          <X className="h-4 w-4 mr-2" />
          {t.superAdmin.resetFilters}
        </Button>
      </div>
    </div>
  );
}