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

interface Step3LocationCareerProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    cities: string[];
    states: string[];
    educationLevels: string[];
    professions: string[];
  };
}

export function Step3LocationCareer({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: Step3LocationCareerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location & Career</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide location and professional details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.city || ""}
              onValueChange={(value) => onChange("city", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state || ""}
              onValueChange={(value) => onChange("state", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country (Optional)</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder="e.g., India"
              className="w-full"
            />
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Select
              value={formData.education || ""}
              onValueChange={(value) => onChange("education", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.educationLevels.map((edu) => (
                  <SelectItem key={edu} value={edu}>
                    {edu}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title (Optional)</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle || ""}
              onChange={(e) => onChange("jobTitle", e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full"
            />
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation">Designation (Optional)</Label>
            <Input
              id="designation"
              value={formData.designation || ""}
              onChange={(e) => onChange("designation", e.target.value)}
              placeholder="e.g., Team Lead"
              className="w-full"
            />
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <Label htmlFor="sector">Sector (Optional)</Label>
            <Select
              value={formData.sector || ""}
              onValueChange={(value) => onChange("sector", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.professions.map((prof) => (
                  <SelectItem key={prof} value={prof}>
                    {prof}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Annual Income (Optional)</Label>
            <Input
              id="salary"
              value={formData.salary || ""}
              onChange={(e) => onChange("salary", e.target.value)}
              placeholder="e.g., ₹12 LPA"
              className="w-full"
            />
          </div>
        </div>

        <div className="border-t border-muted"></div>

        <div className="space-y-4">
          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription || ""}
              onChange={(e) => onChange("jobDescription", e.target.value)}
              placeholder="Brief description of current role"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Plans Abroad */}
          <div className="space-y-2">
            <Label htmlFor="plansAbroad">Plans to Settle Abroad (Optional)</Label>
            <Input
              id="plansAbroad"
              value={formData.plansAbroad || ""}
              onChange={(e) => onChange("plansAbroad", e.target.value)}
              placeholder="e.g., Yes, planning to move to USA"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}