import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Query to get all profiles with optional filters
export const list = query({
  args: {
    search: v.optional(v.string()),
    gender: v.optional(v.string()),
    minAge: v.optional(v.number()),
    maxAge: v.optional(v.number()),
    religion: v.optional(v.string()),
    verified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    let profiles = await ctx.db.query("profiles").collect();

    // Apply filters
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      profiles = profiles.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.email?.toLowerCase().includes(searchLower)
      );
    }

    if (args.gender) {
      profiles = profiles.filter((p) => p.gender === args.gender);
    }

    if (args.minAge !== undefined) {
      profiles = profiles.filter((p) => p.age >= args.minAge!);
    }

    if (args.maxAge !== undefined) {
      profiles = profiles.filter((p) => p.age <= args.maxAge!);
    }

    if (args.religion) {
      profiles = profiles.filter((p) => p.religion === args.religion);
    }

    if (args.verified !== undefined) {
      profiles = profiles.filter((p) => p.verified === args.verified);
    }

    return profiles.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Query to get recent profiles
export const getRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("profiles")
      .order("desc")
      .take(args.limit);
  },
});

// Query to get pending verification profiles
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    // Efficient, scoped pending list for the current user
    const pending = await ctx.db
      .query("profiles")
      .withIndex("by_createdBy_and_verified", (q) =>
        q.eq("createdBy", user._id).eq("verified", false)
      )
      .collect();

    return pending;
  },
});

// Query to get dashboard stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const profiles = await ctx.db.query("profiles").collect();
    
    return {
      total: profiles.length,
      male: profiles.filter((p) => p.gender === "male").length,
      female: profiles.filter((p) => p.gender === "female").length,
      verified: profiles.filter((p) => p.verified).length,
      pending: profiles.filter((p) => !p.verified).length,
    };
  },
});

// Mutation to create a new profile
export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    age: v.number(),
    gender: v.string(),
    religion: v.string(),
    caste: v.optional(v.string()),
    education: v.string(),
    occupation: v.string(),
    income: v.optional(v.string()),
    height: v.optional(v.string()),
    maritalStatus: v.string(),
    city: v.string(),
    state: v.string(),
    fatherName: v.optional(v.string()),
    motherName: v.optional(v.string()),
    siblings: v.optional(v.string()),
    expectations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    return await ctx.db.insert("profiles", {
      ...args,
      verified: false,
      createdBy: user._id,
    });
  },
});

// Mutation to verify a profile
export const verify = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Load the profile to see if it came from a public link
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error("Profile not found");

    // Mark verified
    await ctx.db.patch(args.profileId, { verified: true });

    // If a public token was used to create this profile, revoke it now (one-time link behavior)
    const token = (profile as any).publicToken as string | undefined;
    if (token && token.trim().length > 0) {
      // Try new tokens table
      const tokenDoc = await ctx.db
        .query("publicFormTokens")
        .withIndex("by_token", (q) => q.eq("token", token))
        .unique()
        .catch(() => null);

      if (tokenDoc) {
        await ctx.db.delete(tokenDoc._id);
      } else {
        // Legacy path: clear the single-token fields on the user if they match
        const legacyUser = await ctx.db
          .query("users")
          .withIndex("by_publicFormToken", (q) => q.eq("publicFormToken", token))
          .unique()
          .catch(() => null);

        if (legacyUser) {
          await ctx.db.patch(legacyUser._id, {
            publicFormToken: undefined,
            publicFormTokenExpiresAt: undefined,
          } as any);
        }
      }

      // Optionally scrub the token from the profile to avoid re-processing
      await ctx.db.patch(args.profileId, { publicToken: undefined } as any);
    }
  },
});

// Mutation to update a profile
export const update = mutation({
  args: {
    profileId: v.id("profiles"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    age: v.optional(v.number()),
    education: v.optional(v.string()),
    occupation: v.optional(v.string()),
    income: v.optional(v.string()),
    height: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    expectations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const { profileId, ...updates } = args;
    await ctx.db.patch(profileId, updates);
  },
});

// Mutation to delete a profile
export const remove = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.delete(args.profileId);
  },
});

export const createPublic = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    age: v.number(),
    gender: v.string(),
    religion: v.string(),
    caste: v.optional(v.string()),
    education: v.string(),
    occupation: v.string(),
    income: v.optional(v.string()),
    height: v.optional(v.string()),
    maritalStatus: v.string(),
    city: v.string(),
    state: v.string(),
    fatherName: v.optional(v.string()),
    motherName: v.optional(v.string()),
    siblings: v.optional(v.string()),
    expectations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // First: look up by new tokens table
    const tokenDoc = await ctx.db
      .query("publicFormTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    let ownerUserId = null;

    if (tokenDoc) {
      const now = Date.now();
      if (tokenDoc.expiresAt <= now) {
        throw new Error("Link expired");
      }
      const owner = await ctx.db.get(tokenDoc.userId);
      if (!owner) throw new Error("Invalid link");
      if (!owner.publicFormEnabled) throw new Error("Public form access disabled");
      ownerUserId = owner._id;
    } else {
      // Backward compatibility: old single-token-on-user path
      const user = await ctx.db
        .query("users")
        .withIndex("by_publicFormToken", (q) => q.eq("publicFormToken", args.token))
        .unique();

      if (!user) throw new Error("Invalid link");
      if (!user.publicFormEnabled) throw new Error("Public form access disabled");

      const now = Date.now();
      if (!user.publicFormTokenExpiresAt || user.publicFormTokenExpiresAt <= now) {
        throw new Error("Link expired");
      }
      ownerUserId = user._id;
    }

    const { token, ...profileFields } = args;

    return await ctx.db.insert("profiles", {
      ...profileFields,
      verified: false,
      createdBy: ownerUserId!,
      // Store token used so we can revoke it after verification
      publicToken: token,
    });
  },
});