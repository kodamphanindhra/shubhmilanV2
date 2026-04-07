import { useState, useEffect, useMemo } from "react";
import { mockProfiles } from "@/mockData/profiles";
import { MatchFilters, ProfileMatch } from "@/types/matchProfile";

export function useMatchProfile() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileMatch | null>(null);
  const [filters, setFilters] = useState<MatchFilters>({});
  const [loading, setLoading] = useState(false);

  // Convert mock profiles to ProfileMatch format
  const profiles: ProfileMatch[] = useMemo(() => {
    return mockProfiles.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender as "male" | "female",
      education: p.education,
      occupation: p.occupation,
      city: p.city,
      state: p.state,
      caste: p.caste,
      maritalStatus: p.maritalStatus,
      religion: p.religion,
      email: p.email,
      phone: p.phone,
      height: p.height,
      income: p.income,
      verified: p.verified,
    }));
  }, []);

  // Auto-set opposite gender filter when profile is selected
  useEffect(() => {
    if (selectedProfile) {
      const oppositeGender = selectedProfile.gender === "male" ? "female" : "male";
      setFilters((prev) => ({ ...prev, gender: oppositeGender }));
    }
  }, [selectedProfile]);

  // Filter matching profiles
  const matches = useMemo(() => {
    if (!selectedProfile) return [];

    setLoading(true);
    const filtered = profiles.filter((profile) => {
      // Exclude the selected profile itself
      if (profile.id === selectedProfile.id) return false;

      // Gender filter (opposite by default)
      if (filters.gender && profile.gender !== filters.gender) return false;

      // Age range filter
      if (filters.minAge !== undefined && profile.age < filters.minAge) return false;
      if (filters.maxAge !== undefined && profile.age > filters.maxAge) return false;

      // Location filter
      if (filters.location && !profile.city.toLowerCase().includes(filters.location.toLowerCase()) && !profile.state.toLowerCase().includes(filters.location.toLowerCase())) return false;

      // Education filter
      if (filters.education && !profile.education.toLowerCase().includes(filters.education.toLowerCase())) return false;

      // Occupation filter
      if (filters.occupation && !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase())) return false;

      // Caste filter
      if (filters.caste && profile.caste && !profile.caste.toLowerCase().includes(filters.caste.toLowerCase())) return false;

      // Marital status filter
      if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;

      // Religion filter
      if (filters.religion && profile.religion !== filters.religion) return false;

      return true;
    });

    setTimeout(() => setLoading(false), 300);
    return filtered;
  }, [selectedProfile, filters, profiles]);

  const updateFilters = (newFilters: Partial<MatchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    if (selectedProfile) {
      const oppositeGender = selectedProfile.gender === "male" ? "female" : "male";
      setFilters({ gender: oppositeGender });
    } else {
      setFilters({});
    }
  };

  const clearSelection = () => {
    setSelectedProfile(null);
    setFilters({});
  };

  return {
    profiles,
    selectedProfile,
    setSelectedProfile,
    filters,
    updateFilters,
    clearFilters,
    clearSelection,
    matches,
    loading,
  };
}
