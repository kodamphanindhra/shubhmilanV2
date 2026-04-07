import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileFormData, FormErrors, AddProfileState } from "@/types/addProfile";
import {
  MOCK_CITIES,
  MOCK_EDUCATION_LEVELS,
  MOCK_PROFESSIONS,
  MOCK_CASTES,
  MOCK_RELIGIONS,
  MOCK_MARITAL_STATUS,
  MOCK_MOTHER_TONGUES,
  MOCK_NADIS,
  MOCK_GOTHRAS,
  MOCK_FAMILY_TYPES,
  MOCK_FOOD_HABITS,
  MOCK_DRINKING_HABITS,
  MOCK_SMOKING_HABITS,
  MOCK_HOBBIES,
  MOCK_STATES,
} from "@/mockData/profiles";
import { useProfileData } from "@/context/ProfileDataContext";
import { useEffect } from "react";

const initialFormData: ProfileFormData = {
  name: "",
  gender: "male",
  age: 18,
  email: "",
  mobile: "",
  city: "",
  state: "Telangana",
  education: "",
  height: "",
  religion: "",
  caste: "",
  gothra: "",
  nadi: "",
  motherTongue: "",
  salary: "",
  dob: "",
  maritalStatus: "single",
  aboutMe: "",
  disability: "",
  college: "",
  designation: "",
  occupation: "",
  organization: "",
  familyType: "",
  fatherOccupation: "",
  familyIncome: "",
  foodHabit: "",
  drinking: "",
  smoking: "",
  hobbies: [],
  hasHome: false,
  hasCar: false,
  profilePhoto: null,
  preferredAge: undefined,
  preferredHeight: undefined,
  preferredDiet: "",
  preferredDrinking: "",
  preferredSmoking: "",
  preferredLifestyle: undefined,
};

export function useAddProfile(options?: { publicToken?: string; onSuccessRedirect?: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  // TODO: Replace with real API calls for createProfile and createProfilePublic
  // Example: import { createProfile } from '@/services/api/profile.api';
  const { extractedData, mergeWithFormData } = useProfileData();

  const [state, setState] = useState<AddProfileState>({
    formData: initialFormData,
    errors: {},
    isLoading: false,
    isDirty: false,
    showUnsavedModal: false,
    currentStep: 1,
  });

  // Auto-fill form with extracted data when available
  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      setState((prev) => ({
        ...prev,
        formData: mergeWithFormData(prev.formData),
      }));
    }
  }, [extractedData, mergeWithFormData]);

  const validateField = (name: keyof ProfileFormData, value: any): string | undefined => {
    switch (name) {
      case "name":
        if (!value || value.trim().length < 2) {
          return t.validation.required;
        }
        break;
      case "dob":
        if (!value) {
          return t.validation.required;
        }
        // Validate age from DOB
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return "Age must be at least 18 years";
        }
        if (age > 100) {
          return "Age must be less than 100 years";
        }
        break;
      case "email":
        if (!value) {
          return t.validation.required;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return t.validation.invalidEmail;
        }
        break;
      case "mobile":
        if (!value) {
          return t.validation.required;
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(value.replace(/\s/g, ""))) {
          return t.validation.invalidMobile;
        }
        break;
      case "age":
        if (!value || value < 18 || value > 100) {
          return "Age must be between 18 and 100";
        }
        break;
      case "gender":
      case "city":
      case "education":
        if (!value) {
          return t.validation.required;
        }
        break;
      case "profilePhoto":
        if (value && value instanceof File) {
          const maxSize = 5 * 1024 * 1024;
          if (value.size > maxSize) {
            return "File size must be less than 5MB";
          }
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedTypes.includes(value.type)) {
            return "Only JPG, JPEG, and PNG files are allowed";
          }
        }
        break;
    }
    return undefined;
  };

  const validateBasicForm = (): boolean => {
    const newErrors: FormErrors = {};
    const mandatoryFields: (keyof ProfileFormData)[] = [
      "name",
      "dob",
      "email",
      "mobile",
    ];

    mandatoryFields.forEach((field) => {
      const error = validateField(field, state.formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const mandatoryFields: (keyof ProfileFormData)[] = [
      "name",
      "gender",
      "age",
      "email",
      "mobile",
      "city",
      "education",
    ];

    mandatoryFields.forEach((field) => {
      const error = validateField(field, state.formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Step 1: Basic Details - validate required fields
    if (state.currentStep === 1) {
      const requiredFields: (keyof ProfileFormData)[] = ["name", "gender", "mobile"];
      requiredFields.forEach((field) => {
        const error = validateField(field, state.formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      });
      
      // Validate email format if provided
      if (state.formData.email) {
        const emailError = validateField("email", state.formData.email);
        if (emailError) {
          newErrors.email = emailError;
        }
      }
    }
    
    // Other steps: No required validation, just format validation
    // Steps 2-8 are optional and can be skipped
    
    setState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setState((prev) => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, 8),
        errors: {},
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handlePreviousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      errors: {},
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (step: number) => {
    // Allow navigation to previous steps or current step
    if (step <= state.currentStep) {
      setState((prev) => ({
        ...prev,
        currentStep: step,
        errors: {},
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage for draft functionality
    try {
      localStorage.setItem("profileDraft", JSON.stringify(state.formData));
      toast.success("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      isDirty: true,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };

  const handleBlur = (field: keyof ProfileFormData) => {
    const error = validateField(field, state.formData[field]);
    if (error) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: error },
      }));
    }
  };

  const handleSubmitBasic = async () => {
    if (!validateBasicForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { profilePhoto, hobbies, hasHome, hasCar, ...profileData } = state.formData;

      if (options?.publicToken) {
        await createProfilePublic({
          token: options.publicToken,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.mobile,
          age: profileData.age,
          gender: profileData.gender,
          religion: profileData.religion || "Hindu",
          caste: profileData.caste,
          education: profileData.education,
          occupation: profileData.occupation || "Not Specified",
          income: profileData.salary,
          height: profileData.height,
          maritalStatus: profileData.maritalStatus || "single",
          city: profileData.city,
          state: profileData.state || "India",
        });
      } else {
        await createProfile({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.mobile,
          age: profileData.age,
          gender: profileData.gender,
          religion: profileData.religion || "Hindu",
          caste: profileData.caste,
          education: profileData.education,
          occupation: profileData.occupation || "Not Specified",
          income: profileData.salary,
          height: profileData.height,
          maritalStatus: profileData.maritalStatus || "single",
          city: profileData.city,
          state: profileData.state || "India",
        });
      }

      toast.success(t.toast.profileUpdated || "Profile created successfully!");
      
      localStorage.removeItem("profileDraft");
      
      setState((prev) => ({ ...prev, isDirty: false }));
      if (options?.publicToken) {
        navigate(options.onSuccessRedirect || "/thank-you");
      } else {
        navigate("/profiles");
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(t.toast.profileUpdateFailed || "Failed to create profile");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { profilePhoto, hobbies, hasHome, hasCar, ...profileData } = state.formData;

      if (options?.publicToken) {
        await createProfilePublic({
          token: options.publicToken,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.mobile,
          age: profileData.age,
          gender: profileData.gender,
          religion: profileData.religion || "Hindu",
          caste: profileData.caste,
          education: profileData.education,
          occupation: profileData.occupation || "Not Specified",
          income: profileData.salary,
          height: profileData.height,
          maritalStatus: profileData.maritalStatus || "single",
          city: profileData.city,
          state: profileData.state || "India",
        });
      } else {
        await createProfile({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.mobile,
          age: profileData.age,
          gender: profileData.gender,
          religion: profileData.religion || "Hindu",
          caste: profileData.caste,
          education: profileData.education,
          occupation: profileData.occupation || "Not Specified",
          income: profileData.salary,
          height: profileData.height,
          maritalStatus: profileData.maritalStatus || "single",
          city: profileData.city,
          state: profileData.state || "India",
        });
      }

      toast.success(t.toast.profileUpdated || "Profile created successfully!");
      
      localStorage.removeItem("profileDraft");
      
      setState((prev) => ({ ...prev, isDirty: false }));
      if (options?.publicToken) {
        navigate(options.onSuccessRedirect || "/thank-you");
      } else {
        navigate("/profiles");
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(t.toast.profileUpdateFailed || "Failed to create profile");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleReset = () => {
    setState({
      formData: initialFormData,
      errors: {},
      isLoading: false,
      isDirty: false,
      showUnsavedModal: false,
      currentStep: 1,
    });
    localStorage.removeItem("profileDraft");
    toast.success("Form reset successfully");
  };

  const handleCancel = () => {
    if (state.isDirty) {
      setState((prev) => ({ ...prev, showUnsavedModal: true }));
    } else {
      navigate("/profiles");
    }
  };

  const confirmLeave = () => {
    setState((prev) => ({ ...prev, showUnsavedModal: false, isDirty: false }));
    navigate("/profiles");
  };

  const cancelLeave = () => {
    setState((prev) => ({ ...prev, showUnsavedModal: false }));
  };

  return {
    formData: state.formData,
    errors: state.errors,
    isLoading: state.isLoading,
    isDirty: state.isDirty,
    showUnsavedModal: state.showUnsavedModal,
    currentStep: state.currentStep,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSubmitBasic,
    handleReset,
    handleCancel,
    confirmLeave,
    cancelLeave,
    handleNextStep,
    handlePreviousStep,
    handleStepClick,
    handleSaveDraft,
    dropdownData: {
      cities: MOCK_CITIES,
      educationLevels: MOCK_EDUCATION_LEVELS,
      professions: MOCK_PROFESSIONS,
      castes: MOCK_CASTES,
      religions: MOCK_RELIGIONS,
      maritalStatuses: MOCK_MARITAL_STATUS,
      motherTongues: MOCK_MOTHER_TONGUES,
      nadis: MOCK_NADIS,
      gothras: MOCK_GOTHRAS,
      familyTypes: MOCK_FAMILY_TYPES,
      foodHabits: MOCK_FOOD_HABITS,
      drinkingHabits: MOCK_DRINKING_HABITS,
      smokingHabits: MOCK_SMOKING_HABITS,
      hobbies: MOCK_HOBBIES,
      states: MOCK_STATES,
    },
  };
}