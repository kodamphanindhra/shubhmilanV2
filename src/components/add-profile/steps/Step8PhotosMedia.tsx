import { Label } from "@/components/ui/label";
import { ProfilePhotoUpload } from "@/components/add-profile/ProfilePhotoUpload";
import { ProfileFormData, FormErrors } from "@/types/addProfile";

interface Step8PhotosMediaProps {
  formData: ProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof ProfileFormData, value: any) => void;
  onBlur: (field: keyof ProfileFormData) => void;
}

export function Step8PhotosMedia({
  formData,
  errors,
  onChange,
  onBlur,
}: Step8PhotosMediaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Photos & Media</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload profile photos to make the profile more attractive (Optional).
        </p>
      </div>

      <div className="space-y-4">
        <ProfilePhotoUpload
          file={formData.profilePhoto}
          error={errors.profilePhoto}
          onChange={(file) => onChange("profilePhoto", file)}
        />

        <div className="text-sm text-muted-foreground mt-4">
          <p className="font-medium mb-2">Photo Guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload a clear, recent photo</li>
            <li>Face should be clearly visible</li>
            <li>Avoid group photos</li>
            <li>Professional or casual attire recommended</li>
            <li>Maximum file size: 5MB</li>
            <li>Supported formats: JPG, JPEG, PNG</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
