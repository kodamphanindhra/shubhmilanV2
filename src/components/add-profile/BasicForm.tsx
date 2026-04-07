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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileFormData, FormErrors } from "@/types/addProfile";
import { MOCK_MARITAL_STATUS, MOCK_RELIGIONS, MOCK_CASTES, MOCK_CITIES, MOCK_STATES, MOCK_EDUCATION_LEVELS, MOCK_PROFESSIONS, MOCK_MOTHER_TONGUES, MOCK_NADIS, MOCK_GOTHRAS, MOCK_FAMILY_TYPES, MOCK_FOOD_HABITS, MOCK_DRINKING_HABITS, MOCK_SMOKING_HABITS, MOCK_HOBBIES } from "@/mockData/profiles";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";

interface BasicFormProps {
  formData: ProfileFormData;
  errors: FormErrors;
  isLoading: boolean;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BasicForm({
  formData,
  errors,
  isLoading,
  onChange,
  onBlur,
  onSubmit,
  onCancel,
}: BasicFormProps) {
  // Auto-calculate age from DOB and validate
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // Only update if age has actually changed to prevent infinite loop
      if (age >= 0 && age <= 100 && age !== formData.age) {
        onChange("age", age);
      }
    }
  }, [formData.dob]); // Remove onChange from dependencies to prevent infinite loop

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Details */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Basic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="basic-name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="basic-name"
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                onBlur={() => onBlur("name")}
                placeholder="Enter full name"
                className={`w-full ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Gender - Radio Buttons */}
            <div className="space-y-2">
              <Label>
                Gender <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => onChange("gender", value as "male" | "female" | "other")}
                className="flex flex-wrap gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male" className="font-normal cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female" className="font-normal cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="gender-other" />
                  <Label htmlFor="gender-other" className="font-normal cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="basic-dob">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basic-dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => onChange("dob", e.target.value)}
                  onBlur={() => onBlur("dob")}
                  className={`w-full ${errors.dob ? "border-destructive" : ""}`}
                />
                {errors.dob && (
                  <p className="text-sm text-destructive">{errors.dob}</p>
                )}
              </div>

              {/* Age (Auto-calculated but editable) */}
              <div className="space-y-2">
                <Label htmlFor="basic-age">Age</Label>
                <Input
                  id="basic-age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age || ""}
                  onChange={(e) => onChange("age", parseInt(e.target.value) || 0)}
                  className="w-full"
                  placeholder="Auto-calculated from DOB"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="basic-height">Height</Label>
                <Input
                  id="basic-height"
                  value={formData.height || ""}
                  onChange={(e) => onChange("height", e.target.value)}
                  placeholder="e.g., 5'8&quot;"
                  className="w-full"
                />
              </div>

              {/* Religion */}
              <div className="space-y-2">
                <Label htmlFor="basic-religion">Religion</Label>
                <Select
                  value={formData.religion || ""}
                  onValueChange={(value) => onChange("religion", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_RELIGIONS.map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Caste */}
              <div className="space-y-2">
                <Label htmlFor="basic-caste">Caste</Label>
                <Select
                  value={formData.caste || ""}
                  onValueChange={(value) => onChange("caste", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select caste" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CASTES.map((caste) => (
                      <SelectItem key={caste} value={caste}>
                        {caste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gothra */}
              <div className="space-y-2">
                <Label htmlFor="basic-gothra">Gothra</Label>
                <Input
                  id="basic-gothra"
                  value={formData.gothra || ""}
                  onChange={(e) => onChange("gothra", e.target.value)}
                  placeholder="Enter gothra"
                  className="w-full"
                />
              </div>

              {/* Nadi */}
              <div className="space-y-2">
                <Label htmlFor="basic-nadi">Nadi</Label>
                <Input
                  id="basic-nadi"
                  value={formData.nadi || ""}
                  onChange={(e) => onChange("nadi", e.target.value)}
                  placeholder="Enter nadi"
                  className="w-full"
                />
              </div>

              {/* Mother Tongue */}
              <div className="space-y-2">
                <Label htmlFor="basic-mother-tongue">Mother Tongue</Label>
                <Select
                  value={formData.motherTongue || ""}
                  onValueChange={(value) => onChange("motherTongue", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mother tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_MOTHER_TONGUES.map((tongue) => (
                      <SelectItem key={tongue} value={tongue}>
                        {tongue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Marital Status - Radio Buttons */}
            <div className="space-y-2">
              <Label>
                Marital Status <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.maritalStatus || "single"}
                onValueChange={(value) => onChange("maritalStatus", value)}
                className="flex flex-wrap gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="marital-single" />
                  <Label htmlFor="marital-single" className="font-normal cursor-pointer">Unmarried</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="married" id="marital-married" />
                  <Label htmlFor="marital-married" className="font-normal cursor-pointer">Married</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="divorced" id="marital-divorced" />
                  <Label htmlFor="marital-divorced" className="font-normal cursor-pointer">Divorced</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="widowed" id="marital-widowed" />
                  <Label htmlFor="marital-widowed" className="font-normal cursor-pointer">Widowed</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="basic-salary">Salary (Package)</Label>
                <Select
                  value={formData.salary || ""}
                  onValueChange={(value) => onChange("salary", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below 5L">Below ₹5 Lakhs</SelectItem>
                    <SelectItem value="5-10L">₹5-10 Lakhs</SelectItem>
                    <SelectItem value="10-15L">₹10-15 Lakhs</SelectItem>
                    <SelectItem value="15-20L">₹15-20 Lakhs</SelectItem>
                    <SelectItem value="20-25L">₹20-25 Lakhs</SelectItem>
                    <SelectItem value="25-30L">₹25-30 Lakhs</SelectItem>
                    <SelectItem value="30-35L">₹30-35 Lakhs</SelectItem>
                    <SelectItem value="35-40L">₹35-40 Lakhs</SelectItem>
                    <SelectItem value="40L+">₹40 Lakhs+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="basic-city">City</Label>
                <Input
                  id="basic-city"
                  value={formData.city || ""}
                  onChange={(e) => onChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="w-full"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="basic-state">State</Label>
                <Select
                  value={formData.state || ""}
                  onValueChange={(value) => onChange("state", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="basic-country">Country</Label>
                <Input
                  id="basic-country"
                  value={formData.country || "India"}
                  readOnly
                  disabled
                  className="w-full cursor-not-allowed bg-muted"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 2: About Me */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basic-about">Describe Myself</Label>
              <Textarea
                id="basic-about"
                value={formData.aboutMe || ""}
                onChange={(e) => onChange("aboutMe", e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Disability - Radio Buttons */}
            <div className="space-y-2">
              <Label>Disability</Label>
              <RadioGroup
                value={formData.disability || "No"}
                onValueChange={(value) => onChange("disability", value)}
                className="flex gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="disability-no" />
                  <Label htmlFor="disability-no" className="font-normal cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="disability-yes" />
                  <Label htmlFor="disability-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 3: Education */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basic-education">Highest Qualification</Label>
              <Select
                value={formData.education || ""}
                onValueChange={(value) => onChange("education", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_EDUCATION_LEVELS.map((edu) => (
                    <SelectItem key={edu} value={edu}>
                      {edu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic-college">College / School</Label>
              <Input
                id="basic-college"
                value={formData.college || ""}
                onChange={(e) => onChange("college", e.target.value)}
                placeholder="Enter college or school name"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 4: Career */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Career</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-designation">Designation</Label>
                <Input
                  id="basic-designation"
                  value={formData.designation || ""}
                  onChange={(e) => onChange("designation", e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-profession">Profession</Label>
                <Input
                  id="basic-profession"
                  value={formData.occupation || ""}
                  onChange={(e) => onChange("occupation", e.target.value)}
                  placeholder="Enter profession"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic-organization">Organization</Label>
              <Input
                id="basic-organization"
                value={formData.organization || ""}
                onChange={(e) => onChange("organization", e.target.value)}
                placeholder="Enter organization name"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 5: Family */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Family</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Family Type - Radio Buttons */}
            <div className="space-y-2">
              <Label>Family Type</Label>
              <RadioGroup
                value={formData.familyType || ""}
                onValueChange={(value) => onChange("familyType", value)}
                className="flex gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Nuclear" id="family-nuclear" />
                  <Label htmlFor="family-nuclear" className="font-normal cursor-pointer">Nuclear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Joint" id="family-joint" />
                  <Label htmlFor="family-joint" className="font-normal cursor-pointer">Joint</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-father-occupation">Father Occupation</Label>
                <Input
                  id="basic-father-occupation"
                  value={formData.fatherOccupation || ""}
                  onChange={(e) => onChange("fatherOccupation", e.target.value)}
                  placeholder="Enter father's occupation"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-family-income">Family Income</Label>
                <Select
                  value={formData.familyIncome || ""}
                  onValueChange={(value) => onChange("familyIncome", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below 5L">Below ₹5 Lakhs</SelectItem>
                    <SelectItem value="5-10L">₹5-10 Lakhs</SelectItem>
                    <SelectItem value="10-20L">₹10-20 Lakhs</SelectItem>
                    <SelectItem value="20L+">₹20 Lakhs+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-total-family-members">Total Family Members</Label>
                <Input
                  id="basic-total-family-members"
                  type="number"
                  min="1"
                  value={formData.totalFamilyMembers || ""}
                  onChange={(e) => onChange("totalFamilyMembers", parseInt(e.target.value) || undefined)}
                  placeholder="e.g., 5"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 6: Contact Details */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basic-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  onBlur={() => onBlur("email")}
                  placeholder="email@example.com"
                  className={`w-full ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-mobile">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basic-mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => onChange("mobile", e.target.value)}
                  onBlur={() => onBlur("mobile")}
                  placeholder="10-digit mobile number"
                  className={`w-full ${errors.mobile ? "border-destructive" : ""}`}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive">{errors.mobile}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-alternate-contact">Alternate Contact</Label>
                <Input
                  id="basic-alternate-contact"
                  type="tel"
                  value={formData.secondaryMobile || ""}
                  onChange={(e) => onChange("secondaryMobile", e.target.value)}
                  placeholder="Optional alternate number"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 7: Lifestyle & Interests */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Lifestyle & Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Food Habit - Radio Buttons */}
            <div className="space-y-2">
              <Label>Food Habit</Label>
              <RadioGroup
                value={formData.foodHabit || ""}
                onValueChange={(value) => onChange("foodHabit", value)}
                className="flex flex-wrap gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vegetarian" id="food-veg" />
                  <Label htmlFor="food-veg" className="font-normal cursor-pointer">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non-Vegetarian" id="food-nonveg" />
                  <Label htmlFor="food-nonveg" className="font-normal cursor-pointer">Non-Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Eggetarian" id="food-egg" />
                  <Label htmlFor="food-egg" className="font-normal cursor-pointer">Eggetarian</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Drink - Radio Buttons */}
            <div className="space-y-2">
              <Label>Drink</Label>
              <RadioGroup
                value={formData.drinking || ""}
                onValueChange={(value) => onChange("drinking", value)}
                className="flex flex-wrap gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Never" id="drink-no" />
                  <Label htmlFor="drink-no" className="font-normal cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Occasionally" id="drink-occasionally" />
                  <Label htmlFor="drink-occasionally" className="font-normal cursor-pointer">Occasionally</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Regularly" id="drink-yes" />
                  <Label htmlFor="drink-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Smoke - Radio Buttons */}
            <div className="space-y-2">
              <Label>Smoke</Label>
              <RadioGroup
                value={formData.smoking || ""}
                onValueChange={(value) => onChange("smoking", value)}
                className="flex flex-wrap gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Never" id="smoke-no" />
                  <Label htmlFor="smoke-no" className="font-normal cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Occasionally" id="smoke-occasionally" />
                  <Label htmlFor="smoke-occasionally" className="font-normal cursor-pointer">Occasionally</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Regularly" id="smoke-yes" />
                  <Label htmlFor="smoke-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Hobbies - Checkbox Group */}
            <div className="space-y-2">
              <Label>Hobbies</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MOCK_HOBBIES.map((hobby) => (
                  <div key={hobby} className="flex items-center space-x-2">
                    <Checkbox
                      id={`hobby-${hobby}`}
                      checked={formData.hobbies?.includes(hobby) || false}
                      onCheckedChange={(checked) => {
                        const currentHobbies = formData.hobbies || [];
                        if (checked) {
                          onChange("hobbies", [...currentHobbies, hobby]);
                        } else {
                          onChange("hobbies", currentHobbies.filter((h) => h !== hobby));
                        }
                      }}
                    />
                    <Label htmlFor={`hobby-${hobby}`} className="font-normal cursor-pointer text-sm">
                      {hobby}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 8: Profile Photo */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePhotoUpload
            file={formData.profilePhoto}
            error={errors.profilePhoto}
            onChange={(file) => onChange("profilePhoto", file)}
          />
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 9: Assets */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Own House - Radio Buttons */}
            <div className="space-y-2">
              <Label>Own House</Label>
              <RadioGroup
                value={formData.hasHome ? "Yes" : "No"}
                onValueChange={(value) => onChange("hasHome", value === "Yes")}
                className="flex gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="home-yes" />
                  <Label htmlFor="home-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="home-no" />
                  <Label htmlFor="home-no" className="font-normal cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Own Car - Radio Buttons */}
            <div className="space-y-2">
              <Label>Own Car</Label>
              <RadioGroup
                value={formData.hasCar ? "Yes" : "No"}
                onValueChange={(value) => onChange("hasCar", value === "Yes")}
                className="flex gap-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="car-yes" />
                  <Label htmlFor="car-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="car-no" />
                  <Label htmlFor="car-no" className="font-normal cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic-other-assets">Additional Assets</Label>
              <Input
                id="basic-other-assets"
                value={formData.otherAssets?.join(", ") || ""}
                onChange={(e) => onChange("otherAssets", e.target.value.split(",").map(a => a.trim()).filter(Boolean))}
                placeholder="e.g., Land, Investments"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-muted"></div>

      {/* Section 10: Partner Preferences */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Partner Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Preferred Age Range */}
            <div className="space-y-2">
              <Label>Preferred Age Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pref-age-min" className="text-sm text-muted-foreground">Min Age</Label>
                  <Input
                    id="pref-age-min"
                    type="number"
                    min="18"
                    max="100"
                    value={formData.preferredAge?.min || ""}
                    onChange={(e) => onChange("preferredAge", { 
                      ...formData.preferredAge, 
                      min: parseInt(e.target.value) || 18 
                    })}
                    placeholder="Min"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pref-age-max" className="text-sm text-muted-foreground">Max Age</Label>
                  <Input
                    id="pref-age-max"
                    type="number"
                    min="18"
                    max="100"
                    value={formData.preferredAge?.max || ""}
                    onChange={(e) => onChange("preferredAge", { 
                      ...formData.preferredAge, 
                      max: parseInt(e.target.value) || 100 
                    })}
                    placeholder="Max"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Height Range */}
            <div className="space-y-2">
              <Label>Preferred Height Range (in feet)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pref-height-min" className="text-sm text-muted-foreground">Min Height</Label>
                  <Input
                    id="pref-height-min"
                    type="number"
                    step="0.1"
                    min="4"
                    max="7"
                    value={formData.preferredHeight?.min || ""}
                    onChange={(e) => onChange("preferredHeight", { 
                      ...formData.preferredHeight, 
                      min: parseFloat(e.target.value) || 4 
                    })}
                    placeholder="e.g., 5.0"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pref-height-max" className="text-sm text-muted-foreground">Max Height</Label>
                  <Input
                    id="pref-height-max"
                    type="number"
                    step="0.1"
                    min="4"
                    max="7"
                    value={formData.preferredHeight?.max || ""}
                    onChange={(e) => onChange("preferredHeight", { 
                      ...formData.preferredHeight, 
                      max: parseFloat(e.target.value) || 7 
                    })}
                    placeholder="e.g., 6.0"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Lifestyle */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Preferred Lifestyle</Label>
              
              {/* Preferred Food Habit */}
              <div className="space-y-2">
                <Label>Food Habit</Label>
                <RadioGroup
                  value={formData.preferredDiet || ""}
                  onValueChange={(value) => onChange("preferredDiet", value)}
                  className="flex flex-wrap gap-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vegetarian" id="pref-food-veg" />
                    <Label htmlFor="pref-food-veg" className="font-normal cursor-pointer">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non-Vegetarian" id="pref-food-nonveg" />
                    <Label htmlFor="pref-food-nonveg" className="font-normal cursor-pointer">Non-Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Eggetarian" id="pref-food-egg" />
                    <Label htmlFor="pref-food-egg" className="font-normal cursor-pointer">Eggetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Any" id="pref-food-any" />
                    <Label htmlFor="pref-food-any" className="font-normal cursor-pointer">Any</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Preferred Drinking */}
              <div className="space-y-2">
                <Label>Drinking</Label>
                <RadioGroup
                  value={formData.preferredDrinking || ""}
                  onValueChange={(value) => onChange("preferredDrinking", value)}
                  className="flex flex-wrap gap-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Never" id="pref-drink-no" />
                    <Label htmlFor="pref-drink-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Occasionally" id="pref-drink-occasionally" />
                    <Label htmlFor="pref-drink-occasionally" className="font-normal cursor-pointer">Occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Regularly" id="pref-drink-yes" />
                    <Label htmlFor="pref-drink-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Any" id="pref-drink-any" />
                    <Label htmlFor="pref-drink-any" className="font-normal cursor-pointer">Any</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Preferred Smoking */}
              <div className="space-y-2">
                <Label>Smoking</Label>
                <RadioGroup
                  value={formData.preferredSmoking || ""}
                  onValueChange={(value) => onChange("preferredSmoking", value)}
                  className="flex flex-wrap gap-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Never" id="pref-smoke-no" />
                    <Label htmlFor="pref-smoke-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Occasionally" id="pref-smoke-occasionally" />
                    <Label htmlFor="pref-smoke-occasionally" className="font-normal cursor-pointer">Occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Regularly" id="pref-smoke-yes" />
                    <Label htmlFor="pref-smoke-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Any" id="pref-smoke-any" />
                    <Label htmlFor="pref-smoke-any" className="font-normal cursor-pointer">Any</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}