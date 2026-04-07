import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  BROKER: "Broker",
  ADMIN: "Admin",
  SUPER_ADMIN: "SuperAdmin",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.BROKER),
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.SUPER_ADMIN),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // New fields for settings
      mobile: v.optional(v.string()),
      subscription: v.optional(v.object({
        planId: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        isActive: v.boolean(),
      })),
      // Public Add Profile Form access
      publicFormEnabled: v.optional(v.boolean()),
      publicFormToken: v.optional(v.string()),
      // Add: expiry timestamp for public form token
      publicFormTokenExpiresAt: v.optional(v.number()),
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      // Index to look up user by public token
      .index("by_publicFormToken", ["publicFormToken"]),

    // Profiles table for marriage bureau candidates
    profiles: defineTable({
      name: v.string(),
      email: v.optional(v.string()),
      phone: v.string(),
      age: v.number(),
      gender: v.string(), // "male" or "female"
      religion: v.string(),
      caste: v.optional(v.string()),
      education: v.string(),
      occupation: v.string(),
      income: v.optional(v.string()),
      height: v.optional(v.string()),
      maritalStatus: v.string(), // "single", "divorced", "widowed"
      city: v.string(),
      state: v.string(),
      fatherName: v.optional(v.string()),
      motherName: v.optional(v.string()),
      siblings: v.optional(v.string()),
      expectations: v.optional(v.string()),
      verified: v.boolean(),
      createdBy: v.id("users"),
      // Link token used for public submission (optional, for one-time invalidation after verification)
      publicToken: v.optional(v.string()),
    })
      .index("by_gender", ["gender"])
      .index("by_verified", ["verified"])
      .index("by_created_by", ["createdBy"])
      // Add: efficient index to fetch pending by owner
      .index("by_createdBy_and_verified", ["createdBy", "verified"]),
    
    // New: public form tokens (supports multiple concurrent 24h links)
    publicFormTokens: defineTable({
      userId: v.id("users"),
      token: v.string(),
      expiresAt: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_token", ["token"])
      .index("by_userId_and_expiresAt", ["userId", "expiresAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;