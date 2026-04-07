export interface ProfileFormData {
  // Step 1: Basic Details
  name: string;
  gender: "male" | "female" | "other";
  dob?: string;
  height?: string;
  weight?: string;
  maritalStatus?: string;
  mobile: string;
  secondaryMobile?: string;
  email?: string;
  
  // Step 2: Religion & Cultural Info
  religion?: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  motherTongue?: string;
  languagesKnown?: string[];
  
  // Step 3: Location & Career
  city: string;
  state: string;
  country?: string;
  education: string;
  jobTitle?: string;
  designation?: string;
  sector?: string;
  jobDescription?: string;
  salary?: string;
  plansAbroad?: string;
  
  // Step 4: Family Background
  familyType?: string;
  familyValues?: string;
  familyIncome?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  numberOfSiblings?: number;
  totalFamilyMembers?: number;
  
  // Step 5: Lifestyle & Interests
  foodHabit?: string;
  drinking?: string;
  smoking?: string;
  hobbies?: string[];
  interests?: string[];
  hasHome?: boolean;
  hasCar?: boolean;
  otherAssets?: string[];
  
  // Step 6: Horoscope Details
  rashi?: string;
  nakshatra?: string;
  nadi?: string;
  manglik?: string;
  doshas?: string[];
  kundliMatchRequired?: boolean;
  placeOfBirth?: string;
  timeOfBirth?: string;
  
  // Step 7: Partner Preferences
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredHeightMin?: string;
  preferredHeightMax?: string;
  preferredReligion?: string[];
  preferredCaste?: string[];
  preferredSubCaste?: string[];
  preferredEducation?: string[];
  preferredLocation?: string[];
  preferredDiet?: string;
  preferredDrinking?: string;
  preferredSmoking?: string;
  
  // Basic Form Preferences (simplified)
  preferredAge?: { min: number; max: number };
  preferredHeight?: { min: number; max: number };
  preferredLifestyle?: Partial<Lifestyle>;
  
  // Step 8: Photos & Media
  profilePhotos?: File[];
  
  // Legacy fields (for backward compatibility)
  age: number;
  occupation?: string;
  college?: string;
  organization?: string;
  aboutMe?: string;
  disability?: string;
  profilePhoto: File | null;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface AddProfileState {
  formData: ProfileFormData;
  errors: FormErrors;
  isLoading: boolean;
  isDirty: boolean;
  showUnsavedModal: boolean;
  currentStep: number;
}

export interface Lifestyle {
  diet?: "vegetarian" | "eggetarian" | "nonvegetarian" | "vegan";
  drinking?: "nonDrinker" | "occasional" | "regular";
  smoking?: "nonSmoker" | "occasional" | "regular";
  hobbies?: string[];
  interests?: string[];
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  fields: (keyof ProfileFormData)[];
}