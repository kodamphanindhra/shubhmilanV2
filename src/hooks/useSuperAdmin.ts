import { useState, useEffect, useMemo } from "react";
import { SuperAdminUser, UserFilters, UserFormData, SubscriptionFormData, NewUserFormData } from "@/types/superAdmin";
import { MOCK_SUPER_ADMIN_USERS } from "@/mockData/superAdmin";
import { MOCK_SUBSCRIPTION_PLANS } from "@/mockData/settings";

export function useSuperAdmin() {
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    status: "",
    subscription: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users (using mock data)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers(MOCK_SUPER_ADMIN_USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesSubscription =
        !filters.subscription ||
        (user.subscription && user.subscription.planId === filters.subscription);

      return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
    }).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
  }, [users, filters]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Add new user
  const addUser = async (data: NewUserFormData) => {
    // In production, this would call a Convex mutation
    // For now, we'll add to the mock data
    const newUser: SuperAdminUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role: data.role,
      status: "Active",
      subscription: null,
      moduleAccess: data.moduleAccess,
      authMethod: "mobile",
    };

    setUsers((prev) => [...prev, newUser].sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Update user details
  const updateUser = async (userId: string, data: UserFormData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: data.name, email: data.email, mobile: data.mobile, role: data.role }
          : user
      )
    );
  };

  // Assign subscription to user
  const assignSubscription = async (userId: string, data: SubscriptionFormData) => {
    const plan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === data.planId);
    if (!plan) return;

    const startDate = new Date(data.startDate);
    let endDate = new Date(startDate);

    // Calculate end date based on plan type
    if (plan.type === "Trial" || plan.type === "Onboarding") {
      endDate.setDate(endDate.getDate() + 30);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = {
      planId: plan.id,
      plan: plan.name,
      type: plan.type,
      price: plan.price,
      startDate: data.startDate,
      endDate: endDate.toISOString().split("T")[0],
    };

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, subscription, status: "Active" as const } : user
      )
    );
  };

  // Toggle user status
  const toggleUserStatus = async (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      role: "",
      status: "",
      subscription: "",
    });
    setCurrentPage(1);
  };

  return {
    users: paginatedUsers,
    allUsers: filteredUsers,
    loading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalUsers: filteredUsers.length,
    addUser,
    updateUser,
    assignSubscription,
    toggleUserStatus,
    resetFilters,
  };
}