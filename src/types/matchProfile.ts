export interface MatchFilters {
  gender?: "male" | "female";
  minAge?: number;
  maxAge?: number;
  location?: string;
  education?: string;
  occupation?: string;
  caste?: string;
  maritalStatus?: string;
  religion?: string;
}

export interface ProfileMatch {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  education: string;
  occupation: string;
  city: string;
  state: string;
  caste?: string;
  maritalStatus: string;
  religion: string;
  email?: string;
  phone: string;
  height?: string;
  income?: string;
  verified: boolean;
}
