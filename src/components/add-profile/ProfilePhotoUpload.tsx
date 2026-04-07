import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface ProfilePhotoUploadProps {
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

export function ProfilePhotoUpload({
  file,
  error,
  onChange,
}: ProfilePhotoUploadProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>Profile Photo (Optional)</Label>
      <Card className="p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {file?.name} ({(file!.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="flex flex-col items-center justify-center py-8 cursor-pointer border-2 border-dashed rounded-md hover:border-primary transition-colors"
          >
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Click to upload profile photo
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG (Max 5MB)
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-3">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Profile Photo Upload"
        />
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
