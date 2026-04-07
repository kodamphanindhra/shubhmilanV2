import { FAQItem, SupportContactInfo } from "@/types/support";

export const SUPPORT_CONTACT_INFO: SupportContactInfo = {
  email: "support@shubhmilan.com",
  phone: "+91 1800-123-4567",
  hours: "Monday - Friday, 9:00 AM - 6:00 PM IST"
};

export const SUPPORT_FAQS: FAQItem[] = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by going to Settings > Profile and clicking on 'Change Password'. Enter your current password and then your new password twice to confirm."
  },
  {
    question: "How do I add a new profile?",
    answer: "Navigate to the 'Add Profile' page from the sidebar. You can choose between Basic Mode for quick entry or Detailed Mode for comprehensive information. Fill in the required fields and click 'Save Profile'."
  },
  {
    question: "What subscription plans are available?",
    answer: "We offer multiple subscription plans including Free Trial, Match Filter Plan, Premium Basic, and Premium With Filter. Each plan offers different features and capabilities. Visit the Subscription tab in Settings to view all available plans."
  },
  {
    question: "How does the matching system work?",
    answer: "Our smart matching system uses various criteria including age, location, education, occupation, religion, and preferences to find compatible matches. Go to 'Match Profiles' to select a profile and apply filters to find the best matches."
  },
  {
    question: "How long does profile verification take?",
    answer: "Profile verification typically takes 24-48 hours. Once verified, the profile will be marked with a verified badge. You can check pending verifications from your Dashboard."
  },
  {
    question: "Can I export profile data?",
    answer: "Yes, premium users can export profile data in various formats. This feature is available in the Reports & Analytics section for users with appropriate permissions."
  },
  {
    question: "How do I contact a matched profile?",
    answer: "When you find a match, you can use the 'Contact' button to initiate communication. The system will notify the other party and facilitate the connection based on your subscription plan's features."
  }
];
