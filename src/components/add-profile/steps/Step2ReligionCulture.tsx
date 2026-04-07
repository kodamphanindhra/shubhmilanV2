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

interface Step2ReligionCultureProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    religions: string[];
    castes: string[];
    gothras: string[];
    motherTongues: string[];
  };
}

export function Step2ReligionCulture({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step2ReligionCultureProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Religion & Cultural Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide religious and cultural background details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Religion */}
          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Select
              value={formData.religion || ""}
              onValueChange={(value) => onChange("religion", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.religions.map((religion) => (
                  <SelectItem key={religion} value={religion}>
                    {religion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Caste */}
          <div className="space-y-2">
            <Label htmlFor="caste">Caste</Label>
            <Select
              value={formData.caste || ""}
              onValueChange={(value) => onChange("caste", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select caste" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.castes.map((caste) => (
                  <SelectItem key={caste} value={caste}>
                    {caste}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub Caste */}
          <div className="space-y-2">
            <Label htmlFor="subCaste">Sub Caste (Optional)</Label>
            <Input
              id="subCaste"
              value={formData.subCaste || ""}
              onChange={(e) => onChange("subCaste", e.target.value)}
              placeholder="Enter sub caste"
              className="w-full"
            />
          </div>

          {/* Gothra */}
          <div className="space-y-2">
            <Label htmlFor="gothra">Gothra</Label>
            <Select
              value={formData.gothra || ""}
              onValueChange={(value) => onChange("gothra", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gothra" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.gothras.map((gothra) => (
                  <SelectItem key={gothra} value={gothra}>
                    {gothra}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mother Tongue */}
          <div className="space-y-2">
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Select
              value={formData.motherTongue || ""}
              onValueChange={(value) => onChange("motherTongue", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mother tongue" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.motherTongues.map((tongue) => (
                  <SelectItem key={tongue} value={tongue}>
                    {tongue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Languages Known */}
          <div className="space-y-2">
            <Label htmlFor="languagesKnown">Languages Known (Optional)</Label>
            <Input
              id="languagesKnown"
              value={formData.languagesKnown?.join(", ") || ""}
              onChange={(e) => onChange("languagesKnown", e.target.value.split(",").map(l => l.trim()))}
              placeholder="e.g., English, Hindi, Telugu"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}