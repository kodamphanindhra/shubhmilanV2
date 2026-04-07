import { useState } from "react";
import { toast } from "sonner";
import { ProfileFormData } from "@/types/addProfile";

interface ExtractionResult {
  success: boolean;
  data?: Partial<ProfileFormData>;
  error?: string;
}

// Placeholder OCR/AI extraction function
// In production, this would call an actual OCR API like Google Vision, Tesseract, or AWS Textract
async function extractProfileData(file: File): Promise<ExtractionResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock extraction - in production, this would parse actual OCR results
  // For now, return sample data to demonstrate the feature
  const mockExtractedData: Partial<ProfileFormData> = {
    name: "Sample Name",
    age: 25,
    email: "sample@example.com",
    mobile: "9876543210",
    city: "Hyderabad",
    state: "Telangana",
    religion: "Hindu",
    education: "B.Tech",
    occupation: "Software Engineer",
  };

  // Simulate 80% success rate
  if (Math.random() > 0.2) {
    return {
      success: true,
      data: mockExtractedData,
    };
  } else {
    return {
      success: false,
      error: "Unable to extract details from the image",
    };
  }
}

export function useImageExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, or PDF.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB.");
      return false;
    }

    return true;
  };

  const extractData = async (file: File): Promise<Partial<ProfileFormData> | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setIsExtracting(true);
    setUploadedFile(file);

    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    try {
      const result = await extractProfileData(file);

      if (result.success && result.data) {
        toast.success("Data extracted! Form fields have been auto-filled. Please review.");
        console.log("Extracted data:", result.data); // Debug log
        return result.data;
      } else {
        toast.error(result.error || "Unable to extract details. Please fill manually.");
        return null;
      }
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("An error occurred during extraction. Please try again.");
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const clearUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  return {
    isExtracting,
    uploadedFile,
    previewUrl,
    extractData,
    clearUpload,
  };
}
