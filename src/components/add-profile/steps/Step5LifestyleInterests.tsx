import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileFormData, FormErrors } from "@/types/addProfile";

interface Step5LifestyleInterestsProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    foodHabits: string[];
    drinkingHabits: string[];
    smokingHabits: string[];
    hobbies: string[];
  };
}

export function Step5LifestyleInterests({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step5LifestyleInterestsProps) {
  const toggleHobby = (hobby: string) => {
    const currentHobbies = formData.hobbies || [];
    const newHobbies = currentHobbies.includes(hobby)
      ? currentHobbies.filter((h) => h !== hobby)
      : [...currentHobbies, hobby];
    onChange("hobbies", newHobbies);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lifestyle & Interests</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Share lifestyle preferences and interests.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Food Habit */}
          <div className="space-y-2">
            <Label htmlFor="foodHabit">Food Habit</Label>
            <Select
              value={formData.foodHabit || ""}
              onValueChange={(value) => onChange("foodHabit", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select food habit" />
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
            <Label htmlFor="drinking">Drinking Habit</Label>
            <Select
              value={formData.drinking || ""}
              onValueChange={(value) => onChange("drinking", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select drinking habit" />
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
            <Label htmlFor="smoking">Smoking Habit</Label>
            <Select
              value={formData.smoking || ""}
              onValueChange={(value) => onChange("smoking", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select smoking habit" />
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

        <div className="border-t border-muted"></div>

        {/* Hobbies */}
        <div className="space-y-2">
          <Label>Hobbies & Interests (Optional)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {dropdownData.hobbies.map((hobby) => (
              <div key={hobby} className="flex items-center space-x-2">
                <Checkbox
                  id={`hobby-${hobby}`}
                  checked={formData.hobbies?.includes(hobby) || false}
                  onCheckedChange={() => toggleHobby(hobby)}
                />
                <label
                  htmlFor={`hobby-${hobby}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {hobby}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-muted"></div>

        {/* Other Interests */}
        <div className="space-y-2">
          <Label htmlFor="interests">Other Interests (Optional)</Label>
          <Input
            id="interests"
            value={formData.interests?.join(", ") || ""}
            onChange={(e) => onChange("interests", e.target.value.split(",").map(i => i.trim()))}
            placeholder="e.g., Blogging, Volunteering"
            className="w-full"
          />
        </div>

        <div className="border-t border-muted"></div>

        {/* Assets */}
        <div className="space-y-2">
          <Label>Assets (Optional)</Label>
          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasHome"
                checked={formData.hasHome || false}
                onCheckedChange={(checked) => onChange("hasHome", checked)}
              />
              <label htmlFor="hasHome" className="text-sm font-medium cursor-pointer">
                Own Home
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCar"
                checked={formData.hasCar || false}
                onCheckedChange={(checked) => onChange("hasCar", checked)}
              />
              <label htmlFor="hasCar" className="text-sm font-medium cursor-pointer">
                Own Car
              </label>
            </div>
          </div>
        </div>

        {/* Other Assets */}
        <div className="space-y-2">
          <Label htmlFor="otherAssets">Other Assets (Optional)</Label>
          <Input
            id="otherAssets"
            value={formData.otherAssets?.join(", ") || ""}
            onChange={(e) => onChange("otherAssets", e.target.value.split(",").map(a => a.trim()))}
            placeholder="e.g., Land, Investments"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}