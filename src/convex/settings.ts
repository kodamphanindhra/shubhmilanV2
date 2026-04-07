import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user profile with subscription details
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      role: user.role || "user",
      subscription: user.subscription || null,
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    mobile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, {
      name: args.name,
      mobile: args.mobile,
    });

    return { success: true };
  },
});

// Update password (placeholder - actual implementation would verify current password)
export const updatePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // TODO: Implement actual password verification and update
    // This is a placeholder for the password update logic
    // In production, you would:
    // 1. Verify the current password
    // 2. Hash the new password
    // 3. Update the user's password

    return { success: true };
  },
});

// Get available subscription plans
export const getSubscriptionPlans = query({
  args: {},
  handler: async () => {
    // TODO: Fetch from database or return static plans
    // For now, this will be handled by mock data on frontend
    return [];
  },
});

// Purchase/activate a subscription plan
export const purchasePlan = mutation({
  args: {
    planId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // TODO: Implement payment gateway integration
    // Calculate expiry date based on plan duration
    const startDate = new Date().toISOString();
    const endDate = new Date();
    
    // Set expiry based on plan (simplified logic)
    if (args.planId === "filter_monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await ctx.db.patch(userId, {
      subscription: {
        planId: args.planId,
        startDate,
        endDate: endDate.toISOString(),
        isActive: true,
      },
    });

    return { success: true };
  },
});

function generatePublicToken(): string {
  // 40+ chars high-entropy token
  const part = () => Math.random().toString(36).slice(2);
  return `${part()}${part()}${Date.now().toString(36)}${part()}`;
}

// Get public form settings for the current user
export const getPublicFormSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      enabled: !!user.publicFormEnabled,
      token: user.publicFormToken || null,
      // Include expiry timestamp
      expiresAt: user.publicFormTokenExpiresAt ?? null,
    };
  },
});

// Add: Generate a 24-hour expiring public form token and enable access
export const generateEphemeralPublicFormToken = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const token = generatePublicToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Insert into new tokens table (allow multiple active tokens)
    await ctx.db.insert("publicFormTokens", {
      userId,
      token,
      expiresAt,
    });

    // Keep compatibility with existing fields
    await ctx.db.patch(userId, {
      publicFormEnabled: true,
      publicFormToken: token,
      publicFormTokenExpiresAt: expiresAt,
    });

    return { success: true };
  },
});

// Enable/disable public form access (auto-generate token if enabling and missing)
export const setPublicFormEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const patch: Record<string, any> = { publicFormEnabled: args.enabled };
    if (args.enabled && !user.publicFormToken) {
      patch.publicFormToken = generatePublicToken();
    }

    await ctx.db.patch(userId, patch);
    return { success: true };
  },
});

// Regenerate a new token for the public form link
export const regeneratePublicFormToken = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(userId, { publicFormToken: generatePublicToken() });
    return { success: true };
  },
});

export const listActivePublicFormTokens = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const now = Date.now();
    // Efficiently query by userId and range on expiresAt
    const rows = await ctx.db
      .query("publicFormTokens")
      .withIndex("by_userId_and_expiresAt", (q) =>
        q.eq("userId", userId).gt("expiresAt", now)
      )
      .collect();

    // Sort by soonest expiry
    rows.sort((a, b) => a.expiresAt - b.expiresAt);

    return rows.map((r) => ({
      _id: r._id,
      token: r.token,
      expiresAt: r.expiresAt,
    }));
  },
});

export const revokePublicFormToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Try to revoke from the tokens table first
    const row = await ctx.db
      .query("publicFormTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (row) {
      if (row.userId !== userId) {
        throw new Error("Not allowed");
      }
      await ctx.db.delete(row._id);
    }

    // Also clear legacy user token if it matches
    const user = await ctx.db.get(userId);
    if (user?.publicFormToken === args.token) {
      await ctx.db.patch(userId, {
        publicFormToken: undefined,
        publicFormTokenExpiresAt: undefined,
      });
    }

    return { success: true };
  },
});