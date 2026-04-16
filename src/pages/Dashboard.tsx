import { DashboardChart } from "@/components/DashboardChart";
import { PendingVerification } from "@/components/PendingVerification";
import { RecentProfilesTable } from "@/components/RecentProfilesTable";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { useQuery } from "convex/react";
import { Loader2, Users, UserCheck, UserX } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApi } from "@/hooks/useApi";
import { getDashboard } from "@/services/api";
import { mockDashboardResponse } from "@/mockData/dashboard";

export default function Dashboard() {
  const { isLoading, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: dashboardData, loading: dashboardLoading } = useApi(getDashboard);

  const counts = dashboardData?.counts ?? mockDashboardResponse.counts;
  console.log("Dashboard:", dashboardData);
  const recentVerified = dashboardData?.recentVerified ?? mockDashboardResponse.recentVerified;
  const recentPending = dashboardData?.recentPending ?? mockDashboardResponse.recentPending;

  const goToProfiles = (params?: Record<string, string>) => {
    const query = new URLSearchParams(params ?? {});
    const search = query.toString();
    navigate(search ? `/profiles?${search}` : "/profiles");
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state
  if (isLoading || !isAuthenticated || dashboardLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row md:h-screen md:overflow-hidden">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
            <p className="text-muted-foreground">
              {t.dashboard.welcome}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t.dashboard.totalProfiles}
              value={counts.total}
              icon={Users}
              description={t.dashboard.totalProfilesDesc}
              index={0}
              onClick={() => goToProfiles()}
            />
            <StatCard
              title={t.dashboard.maleProfiles}
              value={counts.male}
              icon={UserCheck}
              description={t.dashboard.maleProfilesDesc}
              index={1}
              onClick={() => goToProfiles({ gender: "male" })}
            />
            <StatCard
              title={t.dashboard.femaleProfiles}
              value={counts.female}
              icon={UserCheck}
              description={t.dashboard.femaleProfilesDesc}
              index={2}
              onClick={() => goToProfiles({ gender: "female" })}
            />
            <StatCard
              title={t.dashboard.pendingVerification}
              value={counts.pending}
              icon={UserX}
              description={t.dashboard.pendingVerificationDesc}
              index={3}
              onClick={() => goToProfiles({ status: "pending" })}
            />
          </div>

          {/* Chart */}
      

          {/* Tables Grid */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 lg:items-stretch">
            <RecentProfilesTable
              profiles={recentVerified}
              loading={dashboardLoading && !dashboardData}
            />
            <PendingVerification
              profiles={recentPending}
              loading={dashboardLoading && !dashboardData}
            />
          </div>

          {/* Footer */}
          <footer className="border-t mt-8 py-3">
            <div className="text-center text-xs text-muted-foreground">
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
      </div>
    </div>
  );
}