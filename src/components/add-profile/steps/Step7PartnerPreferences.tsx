import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileFormData, FormErrors } from "@/types/addProfile";

interface Step7PartnerPreferencesProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    religions: string[];
    castes: string[];
    educationLevels: string[];
    foodHabits: string[];
    drinkingHabits: string[];
    smokingHabits: string[];
  };
}

export function Step7PartnerPreferences({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step7PartnerPreferencesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Partner Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Specify your preferences for a life partner (Optional).
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Range */}
          <div className="space-y-2">
            <Label htmlFor="preferredAgeMin">Minimum Age</Label>
            <Input
              id="preferredAgeMin"
              type="number"
              min="18"
              max="100"
              value={formData.preferredAgeMin || ""}
              onChange={(e) => onChange("preferredAgeMin", parseInt(e.target.value) || undefined)}
              placeholder="e.g., 25"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredAgeMax">Maximum Age</Label>
            <Input
              id="preferredAgeMax"
              type="number"
              min="18"
              max="100"
              value={formData.preferredAgeMax || ""}
              onChange={(e) => onChange("preferredAgeMax", parseInt(e.target.value) || undefined)}
              placeholder="e.g., 35"
              className="w-full"
            />
          </div>

          {/* Height Range */}
          <div className="space-y-2">
            <Label htmlFor="preferredHeightMin">Minimum Height</Label>
            <Input
              id="preferredHeightMin"
              value={formData.preferredHeightMin || ""}
              onChange={(e) => onChange("preferredHeightMin", e.target.value)}
              placeholder="e.g., 5'4&quot;"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredHeightMax">Maximum Height</Label>
            <Input
              id="preferredHeightMax"
              value={formData.preferredHeightMax || ""}
              onChange={(e) => onChange("preferredHeightMax", e.target.value)}
              placeholder="e.g., 6'0&quot;"
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Religion */}
          <div className="space-y-2">
            <Label htmlFor="preferredReligion">Preferred Religion</Label>
            <Input
              id="preferredReligion"
              value={formData.preferredReligion?.join(", ") || ""}
              onChange={(e) => onChange("preferredReligion", e.target.value.split(",").map(r => r.trim()))}
              placeholder="e.g., Hindu, Sikh"
              className="w-full"
            />
          </div>

          {/* Caste */}
          <div className="space-y-2">
            <Label htmlFor="preferredCaste">Preferred Caste</Label>
            <Input
              id="preferredCaste"
              value={formData.preferredCaste?.join(", ") || ""}
              onChange={(e) => onChange("preferredCaste", e.target.value.split(",").map(c => c.trim()))}
              placeholder="e.g., Brahmin, Reddy"
              className="w-full"
            />
          </div>

          {/* Sub Caste */}
          <div className="space-y-2">
            <Label htmlFor="preferredSubCaste">Preferred Sub Caste</Label>
            <Input
              id="preferredSubCaste"
              value={formData.preferredSubCaste?.join(", ") || ""}
              onChange={(e) => onChange("preferredSubCaste", e.target.value.split(",").map(sc => sc.trim()))}
              placeholder="e.g., Vaidiki, Niyogi"
              className="w-full"
            />
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="preferredEducation">Preferred Education</Label>
            <Input
              id="preferredEducation"
              value={formData.preferredEducation?.join(", ") || ""}
              onChange={(e) => onChange("preferredEducation", e.target.value.split(",").map(ed => ed.trim()))}
              placeholder="e.g., B.Tech, MBA"
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t border-muted"></div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="preferredLocation">Preferred Location</Label>
          <Input
            id="preferredLocation"
            value={formData.preferredLocation?.join(", ") || ""}
            onChange={(e) => onChange("preferredLocation", e.target.value.split(",").map(l => l.trim()))}
            placeholder="e.g., Hyderabad, Bangalore, USA"
            className="w-full"
          />
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Diet */}
          <div className="space-y-2">
            <Label htmlFor="preferredDiet">Preferred Diet</Label>
            <Select
              value={formData.preferredDiet || ""}
              onValueChange={(value) => onChange("preferredDiet", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select diet preference" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.foodHabits.map((habit) => (
                  <SelectItem key={habit} value={habit}>
                    {habit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drinking */}
          <div className="space-y-2">
            <Label htmlFor="preferredDrinking">Preferred Drinking Habit</Label>
            <Select
              value={formData.preferredDrinking || ""}
              onValueChange={(value) => onChange("preferredDrinking", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select drinking preference" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.drinkingHabits.map((habit) => (
                  <SelectItem key={habit} value={habit}>
                    {habit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Smoking */}
          <div className="space-y-2">
            <Label htmlFor="preferredSmoking">Preferred Smoking Habit</Label>
            <Select
              value={formData.preferredSmoking || ""}
              onValueChange={(value) => onChange("preferredSmoking", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select smoking preference" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.smokingHabits.map((habit) => (
                  <SelectItem key={habit} value={habit}>
                    {habit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}