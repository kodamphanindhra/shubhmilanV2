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
import { MOCK_MARITAL_STATUS } from "@/mockData/profiles";

interface Step1BasicDetailsProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
}

export function Step1BasicDetails({
  formData,
  errors,
  onChange,
  onBlur,
}: Step1BasicDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Removed duplicate header: Parent renders step title and required-fields note */}

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlur("name")}
            placeholder="Enter full name"
            className={`w-full ${errors.name ? "border-destructive" : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => onChange("gender", value)}
            >
              <SelectTrigger className={`w-full ${errors.gender ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={(e) => onChange("dob", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full"
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={formData.height || ""}
              onChange={(e) => onChange("height", e.target.value)}
              placeholder="e.g., 5'8&quot; or 173 cm"
              className="w-full"
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={formData.weight || ""}
              onChange={(e) => onChange("weight", e.target.value)}
              placeholder="e.g., 70 kg"
              className="w-full"
            />
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={formData.maritalStatus || ""}
              onValueChange={(value) => onChange("maritalStatus", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_MARITAL_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-muted"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => onChange("mobile", e.target.value)}
              onBlur={() => onBlur("mobile")}
              placeholder="10-digit mobile number"
              className={`w-full ${errors.mobile ? "border-destructive" : ""}`}
            />
            {errors.mobile && (
              <p className="text-sm text-destructive mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Secondary Mobile */}
          <div className="space-y-2">
            <Label htmlFor="secondaryMobile">Secondary Mobile (Optional)</Label>
            <Input
              id="secondaryMobile"
              type="tel"
              value={formData.secondaryMobile || ""}
              onChange={(e) => onChange("secondaryMobile", e.target.value)}
              placeholder="Alternate contact number"
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              placeholder="email@example.com"
              className={`w-full ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}