import { useState } from "react";
import { SupportFormData, SupportFormErrors } from "@/types/support";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";

export function useConnectSupport(initialData: Partial<SupportFormData>) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<SupportFormData>({
    name: initialData.name || "",
    email: initialData.email || "",
    role: initialData.role || "",
    category: "technical",
    subject: "",
    description: "",
    attachments: []
  });

  const [errors, setErrors] = useState<SupportFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SupportFormErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = t.support?.validation?.nameRequired || "Name must be at least 2 characters";
    }

    if (!formData.subject || formData.subject.trim().length < 3) {
      newErrors.subject = t.support?.validation?.subjectRequired || "Subject must be at least 3 characters";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = t.support?.validation?.descriptionRequired || "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = t.support?.validation?.categoryRequired || "Please select an issue category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof SupportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof SupportFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful submission
      toast.success(t.support?.successMessage || "Your support request has been submitted successfully!");
      
      // Reset form (keep user info)
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "",
        category: "technical",
        subject: "",
        description: "",
        attachments: []
      });
      setErrors({});
    } catch (error) {
      toast.error(t.support?.errorMessage || "Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: initialData.name || "",
      email: initialData.email || "",
      role: initialData.role || "",
      category: "technical",
      subject: "",
      description: "",
      attachments: []
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleClear
  };
}
