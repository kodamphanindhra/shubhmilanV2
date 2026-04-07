import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Handshake, Home, LogOut, Plus, Settings, Users, Languages, Menu, Shield, Crown, LayoutDashboard, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";

export function Sidebar() {
  const { t, language, setLanguage } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: t.nav.profiles,
      icon: Users,
      path: "/profiles",
    },
    {
      label: t.nav.addProfile,
      icon: UserPlus,
      path: "/add-profile",
    },
    {
      label: t.nav.matchProfiles,
      icon: Handshake,
      iconRight: Crown,
      path: "/match-profile",
    },
    {
      label: t.nav.settings,
      icon: Settings,
      path: "/settings",
    },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        const IconRight = item.iconRight;

        return (
          <Button
            key={item.path}
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => handleNavigation(item.path)}
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {IconRight && <IconRight className="h-4 w-4 text-yellow-500" />}
          </Button>
        );
      })}
    </>
  );

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(t.toast.signedOut);
    navigate("/");
  };

  const handleLanguageChange = (lang: "english" | "telugu" | "hindi" | "tamil" | "kannada" | "marathi" | "gujarati" | "malayalam" | "bengali") => {
    setLanguage(lang);
    const languageNames = {
      english: "English",
      telugu: "తెలుగు",
      hindi: "हिंदी",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
      marathi: "मराठी",
      gujarati: "ગુજરાતી",
      malayalam: "മലയാളം",
      bengali: "বাংলা"
    };
    toast.success(`Language changed to ${languageNames[lang]}`);
  };

  const getLanguageDisplay = () => {
    const displays = {
      english: "English",
      telugu: "తెలుగు",
      hindi: "हिंदी",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
      marathi: "मराठी",
      gujarati: "ગુજરાતી",
      malayalam: "മലയാളം",
      bengali: "বাংলা"
    };
    return displays[language];
  };

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Handshake className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">{t.landing.appName}</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {renderNavItems()}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <Separator className="mb-3" />
        
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground mb-2"
            >
              <Languages className="h-4 w-4" />
              {getLanguageDisplay()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleLanguageChange("english")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("hindi")}>
              हिंदी (Hindi)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("telugu")}>
              తెలుగు (Telugu)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {t.nav.signOut}
        </Button>
      </div>
    </>
  );

  // Mobile view: Hamburger menu with slide-in drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* App Logo in Mobile Navbar */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Handshake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t.landing.appName}</span>
          </Link>

          {/* Language Switcher in Mobile Navbar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleLanguageChange("english")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("hindi")}>
                हिंदी (Hindi)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("telugu")}>
                తెలుగు (Telugu)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Spacer for fixed navbar */}
        <div className="h-16" />
      </>
    );
  }

  // Desktop view: Fixed sidebar
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <SidebarContent />
    </div>
  );
}