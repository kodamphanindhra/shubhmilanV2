// API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile?: string;
    role: 'SuperAdmin' | 'Admin' | 'Assistant' | 'Broker';
    moduleAccess?: string[];
  };
}

export interface ProfileResponse {
  success: boolean;
  profile: {
    id: string;
    name: string;
    age: number;
    gender: string;
    city: string;
    state: string;
    religion: string;
    caste: string;
    education: string;
    occupation: string;
    income: string;
    verified: boolean;
    createdAt: string;
  };
}

export interface ProfileListResponse {
  success: boolean;
  profiles: any[];
  total: number;
}

export interface DashboardResponse {
  success: boolean;
  counts: Counts;
  recentVerified: Profile[];
  recentPending: PendingProfile[];
}

export interface Counts {
  _id: string | null;
  total: number;
  male: number;
  female: number;
  pending: number;
}

export interface Profile {
  _id: string;
  tenantId: string;
  name: string;
  gender: string;
  dob: string;
  height: Measurement;
  weight: Measurement;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  motherTongue: string;
  languagesKnown: string[];
  city: string;
  state: string;
  country: string;
  education: string;
  jobTitle: string;
  designation: string;
  sector: string;
  jobDescription: string;
  income: Income;
  plansAbroad: string;
  familyType: string;
  familyValues: string;
  familyIncome: Income;
  fatherOccupation: string;
  motherOccupation: string;
  siblingsCount: number;
  mobile: string;
  secondaryMobile: string;
  email: string;
  horoscope: Horoscope;
  lifestyle: Lifestyle;
  assets: Assets;
  preferredAge: Range;
  preferredHeight: Range;
  preferredReligion: string[];
  preferredCaste: string[];
  preferredSubCaste: string[];
  preferredEducation: string[];
  preferredLocation: string[];
  preferredLifestyle: PreferredLifestyle;
  mediaFiles: string[];
  status: string;
  profileCompletePercentage: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PendingProfile {
  _id: string;
  tenantId: string;
  name: string;
  gender: string;
  languagesKnown: string[];
  mobile: string;
  horoscope: {
    doshas: string[];
  };
  lifestyle: {
    hobbies: string[];
    interests: string[];
  };
  assets: {
    otherAssets: string[];
  };
  preferredReligion: string[];
  preferredCaste: string[];
  preferredSubCaste: string[];
  preferredEducation: string[];
  preferredLocation: string[];
  mediaFiles: string[];
  status: string;
  profileCompletePercentage: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Measurement {
  raw: string;
  value: number | null;
}

export interface Income {
  raw: string;
  value: number;
}

export interface Horoscope {
  rashi: string;
  nakshatra: string;
  naadi: string;
  manglik: string;
  doshas: string[];
  kundliMatchRequired: boolean;
  placeOfBirth: string;
  timeOfBirth: {
    hour: number | null;
    minute: number | null;
    ampm: "AM" | "PM";
  };
}

export interface Lifestyle {
  diet: string;
  drinking: string;
  smoking: string;
  hobbies: string[];
  interests: string[];
}

export interface Assets {
  ownsHouse: boolean;
  ownsCar: boolean;
  otherAssets: string[];
}

export interface Range {
  min: number;
  max: number;
}

export interface PreferredLifestyle {
  diet: string;
  drinking: string;
  smoking: string;
}

export interface MetaDataResponse {
  success: boolean;
  meta: {
    religions: string[];
    castes: string[];
    states: string[];
    motherTongues: string[];
    educationLevels: string[];
    professions: string[];
  };
}

export interface SupportTicketResponse {
  success: boolean;
  ticket: {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  plans: any[];
}

export interface UsersResponse {
  success: boolean;
  users: any[];
  total: number;
}
