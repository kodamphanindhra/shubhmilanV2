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

interface Step6HoroscopeDetailsProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    nadis: string[];
  };
}

export function Step6HoroscopeDetails({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step6HoroscopeDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horoscope Details</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide astrological and horoscope information (Optional).
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rashi */}
          <div className="space-y-2">
            <Label htmlFor="rashi">Rashi (Moon Sign)</Label>
            <Input
              id="rashi"
              value={formData.rashi || ""}
              onChange={(e) => onChange("rashi", e.target.value)}
              placeholder="e.g., Mesha, Vrishabha"
              className="w-full"
            />
          </div>

          {/* Nakshatra */}
          <div className="space-y-2">
            <Label htmlFor="nakshatra">Nakshatra (Star)</Label>
            <Input
              id="nakshatra"
              value={formData.nakshatra || ""}
              onChange={(e) => onChange("nakshatra", e.target.value)}
              placeholder="e.g., Ashwini, Bharani"
              className="w-full"
            />
          </div>

          {/* Nadi */}
          <div className="space-y-2">
            <Label htmlFor="nadi">Nadi</Label>
            <Select
              value={formData.nadi || ""}
              onValueChange={(value) => onChange("nadi", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select nadi" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.nadis.map((nadi) => (
                  <SelectItem key={nadi} value={nadi}>
                    {nadi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Manglik */}
          <div className="space-y-2">
            <Label htmlFor="manglik">Manglik Status</Label>
            <Select
              value={formData.manglik || ""}
              onValueChange={(value) => onChange("manglik", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select manglik status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Anshik">Anshik (Partial)</SelectItem>
                <SelectItem value="Don't Know">Don't Know</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Place of Birth */}
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth">Place of Birth</Label>
            <Input
              id="placeOfBirth"
              value={formData.placeOfBirth || ""}
              onChange={(e) => onChange("placeOfBirth", e.target.value)}
              placeholder="e.g., Hyderabad"
              className="w-full"
            />
          </div>

          {/* Time of Birth */}
          <div className="space-y-2">
            <Label htmlFor="timeOfBirth">Time of Birth</Label>
            <Input
              id="timeOfBirth"
              type="time"
              value={formData.timeOfBirth || ""}
              onChange={(e) => onChange("timeOfBirth", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t border-muted"></div>

        {/* Doshas */}
        <div className="space-y-2">
          <Label htmlFor="doshas">Doshas (Optional)</Label>
          <Input
            id="doshas"
            value={formData.doshas?.join(", ") || ""}
            onChange={(e) => onChange("doshas", e.target.value.split(",").map(d => d.trim()))}
            placeholder="e.g., Kaal Sarp Dosha, Pitra Dosha"
            className="w-full"
          />
        </div>

        <div className="border-t border-muted"></div>

        {/* Kundli Match Required */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kundliMatchRequired"
              checked={formData.kundliMatchRequired || false}
              onCheckedChange={(checked) => onChange("kundliMatchRequired", checked)}
            />
            <label htmlFor="kundliMatchRequired" className="text-sm font-medium cursor-pointer">
              Kundli Matching Required
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}