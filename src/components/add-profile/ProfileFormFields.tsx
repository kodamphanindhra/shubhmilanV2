import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileFormData, FormErrors } from "@/types/addProfile";
import { useI18n } from "@/hooks/use-i18n";

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
  dropdownData: {
    cities: string[];
    educationLevels: string[];
    professions: string[];
    castes: string[];
    religions: string[];
    maritalStatuses: string[];
    motherTongues: string[];
    nadis: string[];
    gothras: string[];
    familyTypes: string[];
    foodHabits: string[];
    drinkingHabits: string[];
    smokingHabits: string[];
    hobbies: string[];
    states: string[];
  };
}

export function ProfileFormFields({
  formData,
  errors,
  onChange,
  onBlur,
  dropdownData,
}: ProfileFormFieldsProps) {
  const { t } = useI18n();

  const handleHobbyToggle = (hobby: string) => {
    const currentHobbies = formData.hobbies || [];
    const newHobbies = currentHobbies.includes(hobby)
      ? currentHobbies.filter((h) => h !== hobby)
      : [...currentHobbies, hobby];
    onChange("hobbies", newHobbies);
  };

  return (
    <>
      {/* Basic Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Basic Details</h3>
        
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
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => onChange("gender", value)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </div>
          </RadioGroup>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
        </div>

        {/* Age & DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age <span className="text-destructive">*</span></Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={100}
              value={formData.age}
              onChange={(e) => onChange("age", parseInt(e.target.value) || 18)}
              onBlur={() => onBlur("age")}
              className={errors.age ? "border-destructive" : ""}
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => onChange("dob", e.target.value)}
            />
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            value={formData.height}
            onChange={(e) => onChange("height", e.target.value)}
            placeholder="e.g., 5'8'' or 173 cm"
          />
        </div>

        {/* Religion, Caste, Gothra */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Select value={formData.religion} onValueChange={(value) => onChange("religion", value)}>
              <SelectTrigger id="religion" className="w-full">
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.religions.map((religion) => (
                  <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caste">Caste</Label>
            <Select value={formData.caste} onValueChange={(value) => onChange("caste", value)}>
              <SelectTrigger id="caste" className="w-full">
                <SelectValue placeholder="Select caste" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.castes.map((caste) => (
                  <SelectItem key={caste} value={caste}>{caste}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gothra">Gothra</Label>
            <Select value={formData.gothra} onValueChange={(value) => onChange("gothra", value)}>
              <SelectTrigger id="gothra" className="w-full">
                <SelectValue placeholder="Select gothra" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.gothras.map((gothra) => (
                  <SelectItem key={gothra} value={gothra}>{gothra}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nadi & Mother Tongue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nadi">Nadi</Label>
            <Select value={formData.nadi} onValueChange={(value) => onChange("nadi", value)}>
              <SelectTrigger id="nadi" className="w-full">
                <SelectValue placeholder="Select nadi" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.nadis.map((nadi) => (
                  <SelectItem key={nadi} value={nadi}>{nadi}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Select value={formData.motherTongue} onValueChange={(value) => onChange("motherTongue", value)}>
              <SelectTrigger id="motherTongue" className="w-full">
                <SelectValue placeholder="Select mother tongue" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.motherTongues.map((tongue) => (
                  <SelectItem key={tongue} value={tongue}>{tongue}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
            <Select value={formData.city} onValueChange={(value) => onChange("city", value)}>
              <SelectTrigger id="city" className={`w-full ${errors.city ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => onChange("state", value)}>
              <SelectTrigger id="state" className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {dropdownData.states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => onChange("maritalStatus", value)}>
            <SelectTrigger id="maritalStatus" className="w-full">
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.maritalStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* About Me */}
        <div className="space-y-2">
          <Label htmlFor="aboutMe">About Me - Describe Myself</Label>
          <Textarea
            id="aboutMe"
            value={formData.aboutMe}
            onChange={(e) => onChange("aboutMe", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        {/* Disability */}
        <div className="space-y-2">
          <Label htmlFor="disability">Disability (if any)</Label>
          <Input
            id="disability"
            value={formData.disability}
            onChange={(e) => onChange("disability", e.target.value)}
            placeholder="Specify if any"
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Education</h3>
        
        <div className="space-y-2">
          <Label htmlFor="education">Education <span className="text-destructive">*</span></Label>
          <Select value={formData.education} onValueChange={(value) => onChange("education", value)}>
            <SelectTrigger id="education" className={`w-full ${errors.education ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.educationLevels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.education && <p className="text-sm text-destructive">{errors.education}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="college">College/School</Label>
          <Input
            id="college"
            value={formData.college}
            onChange={(e) => onChange("college", e.target.value)}
            placeholder="Enter college or school name"
          />
        </div>
      </div>

      {/* Career Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Career</h3>
        
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => onChange("designation", e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Profession</Label>
          <Select value={formData.occupation} onValueChange={(value) => onChange("occupation", value)}>
            <SelectTrigger id="occupation" className="w-full">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.professions.map((profession) => (
                <SelectItem key={profession} value={profession}>{profession}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={(e) => onChange("organization", e.target.value)}
            placeholder="Enter organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary (Package)</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => onChange("salary", e.target.value)}
            placeholder="e.g., 5-7 LPA"
          />
        </div>
      </div>

      {/* Family Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Family</h3>
        
        <div className="space-y-2">
          <Label>Family Type</Label>
          <RadioGroup
            value={formData.familyType}
            onValueChange={(value) => onChange("familyType", value)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nuclear" id="nuclear" />
                <Label htmlFor="nuclear" className="font-normal cursor-pointer">Nuclear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Joint" id="joint" />
                <Label htmlFor="joint" className="font-normal cursor-pointer">Joint</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherOccupation">Father Occupation</Label>
          <Input
            id="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={(e) => onChange("fatherOccupation", e.target.value)}
            placeholder="Enter father's occupation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyIncome">Family Income</Label>
          <Input
            id="familyIncome"
            value={formData.familyIncome}
            onChange={(e) => onChange("familyIncome", e.target.value)}
            placeholder="e.g., 10-15 LPA"
          />
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            placeholder="Enter email address"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile <span className="text-destructive">*</span></Label>
          <Input
            id="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            onBlur={() => onBlur("mobile")}
            placeholder="Enter 10-digit mobile number"
            className={errors.mobile ? "border-destructive" : ""}
          />
          {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
        </div>
      </div>

      {/* Lifestyle & Interests Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">My Lifestyle & Interests</h3>
        
        <div className="space-y-2">
          <Label>Food Habit</Label>
          <RadioGroup
            value={formData.foodHabit}
            onValueChange={(value) => onChange("foodHabit", value)}
          >
            <div className="flex flex-wrap gap-4">
              {dropdownData.foodHabits.map((habit) => (
                <div key={habit} className="flex items-center space-x-2">
                  <RadioGroupItem value={habit} id={`food-${habit}`} />
                  <Label htmlFor={`food-${habit}`} className="font-normal cursor-pointer">{habit}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Drinking</Label>
          <RadioGroup
            value={formData.drinking}
            onValueChange={(value) => onChange("drinking", value)}
          >
            <div className="flex flex-wrap gap-4">
              {dropdownData.drinkingHabits.map((habit) => (
                <div key={habit} className="flex items-center space-x-2">
                  <RadioGroupItem value={habit} id={`drink-${habit}`} />
                  <Label htmlFor={`drink-${habit}`} className="font-normal cursor-pointer">{habit}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Smoking</Label>
          <RadioGroup
            value={formData.smoking}
            onValueChange={(value) => onChange("smoking", value)}
          >
            <div className="flex flex-wrap gap-4">
              {dropdownData.smokingHabits.map((habit) => (
                <div key={habit} className="flex items-center space-x-2">
                  <RadioGroupItem value={habit} id={`smoke-${habit}`} />
                  <Label htmlFor={`smoke-${habit}`} className="font-normal cursor-pointer">{habit}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Hobbies</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dropdownData.hobbies.map((hobby) => (
              <div key={hobby} className="flex items-center space-x-2">
                <Checkbox
                  id={`hobby-${hobby}`}
                  checked={formData.hobbies?.includes(hobby)}
                  onCheckedChange={() => handleHobbyToggle(hobby)}
                />
                <Label htmlFor={`hobby-${hobby}`} className="font-normal cursor-pointer">{hobby}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Assets</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasHome"
              checked={formData.hasHome}
              onCheckedChange={(checked) => onChange("hasHome", checked)}
            />
            <Label htmlFor="hasHome" className="font-normal cursor-pointer">Own Home</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCar"
              checked={formData.hasCar}
              onCheckedChange={(checked) => onChange("hasCar", checked)}
            />
            <Label htmlFor="hasCar" className="font-normal cursor-pointer">Own Car</Label>
          </div>
        </div>
      </div>
    </>
  );
}