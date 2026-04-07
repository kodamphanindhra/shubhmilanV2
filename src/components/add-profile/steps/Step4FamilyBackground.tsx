import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFormData, FormErrors } from "@/types/addProfile";

interface Step4FamilyBackgroundProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    familyTypes: string[];
  };
}

export function Step4FamilyBackground({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step4FamilyBackgroundProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Family Background</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide information about family background.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Family Type */}
          <div className="space-y-2">
            <Label htmlFor="familyType">Family Type</Label>
            <Select
              value={formData.familyType || ""}
              onValueChange={(value) => onChange("familyType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select family type" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.familyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Family Income */}
          <div className="space-y-2">
            <Label htmlFor="familyIncome">Family Income (Optional)</Label>
            <Input
              id="familyIncome"
              value={formData.familyIncome || ""}
              onChange={(e) => onChange("familyIncome", e.target.value)}
              placeholder="e.g., ₹20 LPA"
              className="w-full"
            />
          </div>

          {/* Father Occupation */}
          <div className="space-y-2">
            <Label htmlFor="fatherOccupation">Father's Occupation (Optional)</Label>
            <Input
              id="fatherOccupation"
              value={formData.fatherOccupation || ""}
              onChange={(e) => onChange("fatherOccupation", e.target.value)}
              placeholder="e.g., Business Owner"
              className="w-full"
            />
          </div>

          {/* Mother Occupation */}
          <div className="space-y-2">
            <Label htmlFor="motherOccupation">Mother's Occupation (Optional)</Label>
            <Input
              id="motherOccupation"
              value={formData.motherOccupation || ""}
              onChange={(e) => onChange("motherOccupation", e.target.value)}
              placeholder="e.g., Homemaker"
              className="w-full"
            />
          </div>

          {/* Number of Siblings */}
          <div className="space-y-2">
            <Label htmlFor="numberOfSiblings">Number of Siblings (Optional)</Label>
            <Input
              id="numberOfSiblings"
              type="number"
              min="0"
              value={formData.numberOfSiblings || ""}
              onChange={(e) => onChange("numberOfSiblings", parseInt(e.target.value) || 0)}
              placeholder="e.g., 2"
              className="w-full"
            />
          </div>

          {/* Total Family Members */}
          <div className="space-y-2">
            <Label htmlFor="totalFamilyMembers">Total Family Members (Optional)</Label>
            <Input
              id="totalFamilyMembers"
              type="number"
              min="1"
              value={formData.totalFamilyMembers || ""}
              onChange={(e) => onChange("totalFamilyMembers", parseInt(e.target.value) || undefined)}
              placeholder="e.g., 5"
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t border-muted"></div>

        {/* Family Values */}
        <div className="space-y-2">
          <Label htmlFor="familyValues">Family Values (Optional)</Label>
          <Textarea
            id="familyValues"
            value={formData.familyValues || ""}
            onChange={(e) => onChange("familyValues", e.target.value)}
            placeholder="Describe family values and traditions"
            rows={3}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}