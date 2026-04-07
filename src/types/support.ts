export type IssueCategory = 
  | "technical"
  | "billing"
  | "feature"
  | "account"
  | "other";

export interface SupportFormData {
  name: string;
  email: string;
  role: string;
  category: IssueCategory;
  subject: string;
  description: string;
  attachments?: File[];
}

export interface SupportFormErrors {
  name?: string;
  subject?: string;
  description?: string;
  category?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SupportContactInfo {
  email: string;
  phone: string;
  hours: string;
}
