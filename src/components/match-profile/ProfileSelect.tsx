import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { ProfileMatch } from "@/types/matchProfile";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSelectProps {
  profiles: ProfileMatch[];
  selectedProfile: ProfileMatch | null;
  onSelect: (profile: ProfileMatch) => void;
  onClear: () => void;
}

export function ProfileSelect({ profiles, selectedProfile, onSelect, onClear }: ProfileSelectProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    let filtered = profiles;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = profiles.filter((p) => p.name.toLowerCase().includes(term));
    }
    // Sort alphabetically by name (A-Z)
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [profiles, searchTerm]);

  const handleSelect = (profile: ProfileMatch) => {
    onSelect(profile);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="profile-search">{t.matchProfile.selectProfile}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="profile-search"
          type="text"
          placeholder={t.matchProfile.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && searchTerm && filteredProfiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-1 max-h-60 w-full sm:w-[350px] max-w-[1080px] overflow-auto rounded-md border bg-popover shadow-lg"
          >
            {filteredProfiles.slice(0, 10).map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelect(profile)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-accent"
              >
                <div className="flex-1">
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.age} {t.profiles.years} • {profile.city}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Profile Display */}
      {selectedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between rounded-md border bg-secondary/50 p-3"
        >
          <div>
            <p className="font-medium">{selectedProfile.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedProfile.age} {t.profiles.years} • {selectedProfile.city}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
