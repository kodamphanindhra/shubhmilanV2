import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import Login from "@/pages/Login.tsx";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profiles from "./pages/Profiles.tsx";
import Settings from "./pages/Settings.tsx";
import MatchProfile from "./pages/MatchProfile.tsx";
import AddProfile from "./pages/AddProfile.tsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.tsx";
import PublicAddProfile from "./pages/PublicAddProfile.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import PublicProfileView from "@/pages/PublicProfileView.tsx";
import "./types/global.d.ts";
import { I18nProvider } from "@/components/I18nProvider.tsx";
import { UserAccessProvider } from "@/context/UserAccessContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ACCESS_KEYS } from "@/types/access";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profiles",
    element: <Profiles />,
  },
  {
    path: "/add-profile",
    element: <AddProfile />,
  },
  {
    path: "/add-profile/:token",
    element: <PublicAddProfile />,
  },
  {
    path: "/p/:id",
    element: <PublicProfileView />,
  },
  {
    path: "/match-profile",
    element: <MatchProfile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/super-admin",
    element: <SuperAdminDashboard />,
  },
  {
    path: "/thank-you",
    element: <ThankYou />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
      <Toaster />
    </I18nProvider>
  </StrictMode>
);