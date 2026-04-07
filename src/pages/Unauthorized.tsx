import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function Unauthorized() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">
              {t.access?.denied || "Access Denied"}
            </CardTitle>
            <CardDescription>
              {t.access?.deniedDescription || 
                "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full"
            >
              {t.access?.backToDashboard || "Back to Dashboard"}
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full"
            >
              {t.access?.goBack || "Go Back"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
