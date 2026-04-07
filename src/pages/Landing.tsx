import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, Shield, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleNavigateDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <Handshake className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">{t.landing.appName}</span>
          </div>
          <Button onClick={handleNavigateDashboard} size="sm" className="sm:h-10">
            {t.landing.dashboard}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Handshake className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {t.landing.heroTitle}
            <br />
            {t.landing.heroSubtitle}
          </h1>
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg text-muted-foreground px-4">
            {t.landing.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Button size="lg" onClick={handleNavigateDashboard} className="gap-2 w-full sm:w-auto">
              {t.landing.goToDashboard}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t.landing.learnMore}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 text-center"
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              {t.landing.featuresSubtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: t.landing.profileManagement,
                description: t.landing.profileManagementDesc,
              },
              {
                icon: Handshake,
                title: t.landing.smartMatching,
                description: t.landing.smartMatchingDesc,
              },
              {
                icon: Shield,
                title: t.landing.verificationSystem,
                description: t.landing.verificationSystemDesc,
              },
              {
                icon: Zap,
                title: t.landing.quickAccess,
                description: t.landing.quickAccessDesc,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-lg border bg-card p-5 sm:p-6"
              >
                <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-8 sm:p-10 md:p-12 text-center"
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight">
              {t.landing.ctaTitle}
            </h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground px-4">
              {t.landing.ctaDescription}
            </p>
            <Button size="lg" onClick={handleNavigateDashboard} className="gap-2 w-full sm:w-auto">
              {t.landing.goToDashboard}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            © 2024 ShubhMilan presented by{" "}
            <a
              href="https://vedicbits.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-all"
              aria-label="Visit VedicBits website"
            >
              VedicBits
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}