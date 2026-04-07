import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { MatchFilters as MatchFiltersType } from "@/types/matchProfile";
import { FilterX } from "lucide-react";
import { useState, useEffect } from "react";

interface MatchFiltersProps {
  filters: MatchFiltersType;
  onFilterChange: (filters: Partial<MatchFiltersType>) => void;
  onClearFilters: () => void;
  onClose: () => void;
  disabled?: boolean;
}

export function MatchFilters({ filters, onFilterChange, onClearFilters, onClose, disabled }: MatchFiltersProps) {
  const { t } = useI18n();
  const [localFilters, setLocalFilters] = useState<MatchFiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalChange = (newFilters: Partial<MatchFiltersType>) => {
    setLocalFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Age Range - Side by Side */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="minAge" className="text-xs sm:text-sm">{t.matchProfile.minAge}</Label>
            <Input
              id="minAge"
              type="number"
              placeholder="18"
              value={localFilters.minAge || ""}
              onChange={(e) => handleLocalChange({ minAge: e.target.value ? Number(e.target.value) : undefined })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="maxAge" className="text-xs sm:text-sm">{t.matchProfile.maxAge}</Label>
            <Input
              id="maxAge"
              type="number"
              placeholder="60"
              value={localFilters.maxAge || ""}
              onChange={(e) => handleLocalChange({ maxAge: e.target.value ? Number(e.target.value) : undefined })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
        </div>

        {/* Location and Education - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="location" className="text-xs sm:text-sm">{t.profiles.location}</Label>
            <Input
              id="location"
              type="text"
              placeholder={t.matchProfile.locationPlaceholder}
              value={localFilters.location || ""}
              onChange={(e) => handleLocalChange({ location: e.target.value })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="education" className="text-xs sm:text-sm">{t.profiles.education}</Label>
            <Input
              id="education"
              type="text"
              placeholder={t.matchProfile.educationPlaceholder}
              value={localFilters.education || ""}
              onChange={(e) => handleLocalChange({ education: e.target.value })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
        </div>

        {/* Occupation and Caste - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="occupation" className="text-xs sm:text-sm">{t.profiles.occupation}</Label>
            <Input
              id="occupation"
              type="text"
              placeholder={t.matchProfile.occupationPlaceholder}
              value={localFilters.occupation || ""}
              onChange={(e) => handleLocalChange({ occupation: e.target.value })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="caste" className="text-xs sm:text-sm">{t.profiles.caste}</Label>
            <Input
              id="caste"
              type="text"
              placeholder={t.matchProfile.castePlaceholder}
              value={localFilters.caste || ""}
              onChange={(e) => handleLocalChange({ caste: e.target.value })}
              disabled={disabled}
              className="h-9 sm:h-10 w-full"
            />
          </div>
        </div>

        {/* Religion and Marital Status - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="religion" className="text-xs sm:text-sm">{t.profiles.religion}</Label>
            <Select
              value={localFilters.religion || "all"}
              onValueChange={(value) => handleLocalChange({ religion: value === "all" ? undefined : value })}
              disabled={disabled}
            >
              <SelectTrigger id="religion" className="h-9 sm:h-10 w-full">
                <SelectValue placeholder={t.profiles.allReligions} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.profiles.allReligions}</SelectItem>
                <SelectItem value="Hindu">{t.profiles.hindu}</SelectItem>
                <SelectItem value="Sikh">{t.profiles.sikh}</SelectItem>
                <SelectItem value="Muslim">{t.profiles.muslim}</SelectItem>
                <SelectItem value="Christian">{t.profiles.christian}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-0">
            <Label htmlFor="maritalStatus" className="text-xs sm:text-sm">{t.profiles.maritalStatus}</Label>
            <Select
              value={localFilters.maritalStatus || "all"}
              onValueChange={(value) => handleLocalChange({ maritalStatus: value === "all" ? undefined : value })}
              disabled={disabled}
            >
              <SelectTrigger id="maritalStatus" className="h-9 sm:h-10 w-full">
                <SelectValue placeholder={t.matchProfile.allMaritalStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.matchProfile.allMaritalStatus}</SelectItem>
                <SelectItem value="single">{t.matchProfile.single}</SelectItem>
                <SelectItem value="divorced">{t.matchProfile.divorced}</SelectItem>
                <SelectItem value="widowed">{t.matchProfile.widowed}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleClear} variant="outline" className="flex-1" disabled={disabled}>
          <FilterX className="mr-2 h-4 w-4" />
          {t.profiles.clearFilters}
        </Button>
        <Button onClick={handleApply} className="flex-1" disabled={disabled}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}