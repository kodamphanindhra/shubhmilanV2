import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface VideoIntroModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  translations: {
    title: string;
    description: string;
    skipVideo: string;
    continueToAuth: string;
  };
}

export function VideoIntroModal({
  open,
  onClose,
  onContinue,
  translations,
}: VideoIntroModalProps) {
  const [videoEnded, setVideoEnded] = useState(false);

  // Replace this URL with your actual video URL
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleContinue = () => {
    onContinue();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {translations.title}
          </DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title="ShubhMilan Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onEnded={handleVideoEnd}
          />
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {translations.skipVideo}
          </Button>
          <Button
            onClick={handleContinue}
            className="w-full sm:w-auto gap-2"
          >
            <Play className="h-4 w-4" />
            {translations.continueToAuth}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}