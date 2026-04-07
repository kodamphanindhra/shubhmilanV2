import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, FileText, Image as ImageIcon } from "lucide-react";
import { useImageExtraction } from "@/hooks/useImageExtraction";
import { useProfileData } from "@/context/ProfileDataContext";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImageUploadCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isExtracting, uploadedFile, previewUrl, extractData, clearUpload } = useImageExtraction();
  const { setExtractedData } = useProfileData();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extractedData = await extractData(file);
    if (extractedData) {
      console.log("Setting extracted data to context:", extractedData); // Debug log
      setExtractedData(extractedData);
    }

    // Reset input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    clearUpload();
    setExtractedData(null);
  };

  return (
    // {/* Image Upload Section */}
    //       <div className="mb-6">
    //         <ImageUploadCard />
    //       </div>
    <Card className="rounded-xl shadow-sm border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Image to Retrieve Data (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          {!uploadedFile && !isExtracting && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Optional – upload biodata or ID to auto-fill details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-muted-foreground text-center">
                Supported formats: JPG, PNG, PDF (Max 10MB)
              </p>
            </>
          )}

          {isExtracting && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Extracting details, please wait...
              </p>
            </div>
          )}

          {uploadedFile && !isExtracting && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {uploadedFile.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {uploadedFile.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {previewUrl && (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              )}

              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                ✓ Details extracted successfully. Review and edit as needed.
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
