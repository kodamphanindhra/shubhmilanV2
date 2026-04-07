import { createContext, useContext, useState, ReactNode } from "react";
import { ProfileFormData } from "@/types/addProfile";

interface ProfileDataContextType {
  extractedData: Partial<ProfileFormData> | null;
  setExtractedData: (data: Partial<ProfileFormData> | null) => void;
  mergeWithFormData: (currentData: ProfileFormData) => ProfileFormData;
}

const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined);

export function ProfileDataProvider({ children }: { children: ReactNode }) {
  const [extractedData, setExtractedData] = useState<Partial<ProfileFormData> | null>(null);

  const mergeWithFormData = (currentData: ProfileFormData): ProfileFormData => {
    if (!extractedData) {
      console.log("No extracted data to merge");
      return currentData;
    }

    console.log("Merging extracted data:", extractedData);
    console.log("Current form data:", currentData);

    // Only fill empty fields - never overwrite user-entered data
    const merged: ProfileFormData = { ...currentData };
    
    Object.keys(extractedData).forEach((key) => {
      const fieldKey = key as keyof ProfileFormData;
      const currentValue = currentData[fieldKey];
      const extractedValue = extractedData[fieldKey];
      
      // Only update if current field is empty/default and extracted value exists
      if (extractedValue !== undefined && extractedValue !== null) {
        if (typeof currentValue === "string" && currentValue.trim() === "") {
          (merged as any)[fieldKey] = extractedValue;
          console.log(`Merged field ${key}:`, extractedValue);
        } else if (typeof currentValue === "number" && (currentValue === 0 || currentValue === 18)) {
          (merged as any)[fieldKey] = extractedValue;
          console.log(`Merged field ${key}:`, extractedValue);
        } else if (currentValue === null || currentValue === undefined) {
          (merged as any)[fieldKey] = extractedValue;
          console.log(`Merged field ${key}:`, extractedValue);
        }
      }
    });

    console.log("Final merged data:", merged);
    return merged;
  };

  return (
    <ProfileDataContext.Provider value={{ extractedData, setExtractedData, mergeWithFormData }}>
      {children}
    </ProfileDataContext.Provider>
  );
}

export function useProfileData() {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
}