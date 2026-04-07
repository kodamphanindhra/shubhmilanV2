import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SubscriptionPlans } from "@/components/settings/SubscriptionPlans";
import { ConnectSupportForm } from "@/components/settings/ConnectSupportForm";
import { SupportFAQ } from "@/components/settings/SupportFAQ";
import { User, CreditCard, Mail, Phone, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { SUPPORT_CONTACT_INFO } from "@/mockData/support";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    document.title = `${t.settings.title} - ${t.landing.appName}`;
  }, [t]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col md:flex-row md:h-screen md:overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">{t.settings.title}</h1>
              <p className="text-muted-foreground mt-2">{t.settings.subtitle}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 gap-1">
                <TabsTrigger value="profile">{t.settings.profile}</TabsTrigger>
                <TabsTrigger value="subscription">{t.settings.subscription}</TabsTrigger>
                <TabsTrigger value="support">{t.support.title}</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProfileForm />
                  </motion.div>
                </TabsContent>

              <TabsContent value="subscription" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscriptionPlans />
                  </motion.div>
                </TabsContent>

              <TabsContent value="support" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Quick Contact Section */}
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">{t.support?.quickContact || "Quick Contact"}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{t.support?.email || "Email"}</p>
                              <p className="text-sm text-muted-foreground">{SUPPORT_CONTACT_INFO.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-primary mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{t.support?.phone || "Phone"}</p>
                              <p className="text-sm text-muted-foreground">{SUPPORT_CONTACT_INFO.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{t.support?.hours || "Support Hours"}</p>
                              <p className="text-sm text-muted-foreground">{SUPPORT_CONTACT_INFO.hours}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Support Form */}
                    <ConnectSupportForm 
                      userName={user?.name || ""}
                      userEmail={user?.email || ""}
                      userRole={user?.role || "User"}
                    />

                    {/* FAQ Section */}
                    <SupportFAQ />
                  </motion.div>
                </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}