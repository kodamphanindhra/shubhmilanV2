import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Seed a small set of profiles with a mix of verified and pending statuses.
// If profiles already exist, this is a no-op to avoid duplicates.
export const seedVerifiedAndPending = mutation({
  args: {},
  handler: async (ctx) => {
    // If any profiles exist already, skip seeding to prevent duplicates
    const anyExisting = await ctx.db.query("profiles").take(1);
    if (anyExisting.length > 0) {
      return { skipped: true, reason: "profiles already exist" };
    }

    // Choose any existing user as owner; require at least one user to exist.
    const anyUser = await ctx.db.query("users").take(1);
    if (anyUser.length === 0) {
      return { skipped: true, reason: "no users found; sign in once to create a user" };
    }
    const ownerId = anyUser[0]._id as Id<"users">;

    const samples: Array<Record<string, any>> = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 98765 43210",
        age: 28,
        gender: "male",
        religion: "Hindu",
        caste: "Brahmin",
        education: "B.Tech Computer Science",
        occupation: "Software Engineer",
        income: "₹12 LPA",
        height: "5'10\"",
        maritalStatus: "single",
        city: "Bangalore",
        state: "Karnataka",
        verified: true,
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43211",
        age: 26,
        gender: "female",
        religion: "Hindu",
        caste: "Rajput",
        education: "MBA Finance",
        occupation: "Financial Analyst",
        income: "₹10 LPA",
        height: "5'5\"",
        maritalStatus: "single",
        city: "Mumbai",
        state: "Maharashtra",
        verified: true,
      },
      {
        name: "Amit Patel",
        email: "amit.patel@email.com",
        phone: "+91 98765 43212",
        age: 32,
        gender: "male",
        religion: "Hindu",
        caste: "Patel",
        education: "CA (Chartered Accountant)",
        occupation: "Senior Accountant",
        income: "₹15 LPA",
        height: "5'8\"",
        maritalStatus: "single",
        city: "Ahmedabad",
        state: "Gujarat",
        verified: false,
      },
      {
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 98765 43213",
        age: 25,
        gender: "female",
        religion: "Hindu",
        caste: "Reddy",
        education: "MBBS",
        occupation: "Doctor",
        income: "₹18 LPA",
        height: "5'6\"",
        maritalStatus: "single",
        city: "Hyderabad",
        state: "Telangana",
        verified: true,
      },
      {
        name: "Arjun Singh",
        email: "arjun.singh@email.com",
        phone: "+91 98765 43214",
        age: 30,
        gender: "male",
        religion: "Sikh",
        caste: "Jat",
        education: "B.Com",
        occupation: "Business Owner",
        income: "₹20 LPA",
        height: "6'0\"",
        maritalStatus: "single",
        city: "Delhi",
        state: "Delhi",
        verified: false,
      },
      {
        name: "Kavya Iyer",
        email: "kavya.iyer@email.com",
        phone: "+91 98765 43215",
        age: 27,
        gender: "female",
        religion: "Hindu",
        caste: "Iyer",
        education: "M.Sc Physics",
        occupation: "Research Scientist",
        income: "₹9 LPA",
        height: "5'4\"",
        maritalStatus: "single",
        city: "Chennai",
        state: "Tamil Nadu",
        verified: true,
      },
    ];

    for (const s of samples) {
      await ctx.db.insert("profiles", {
        ...(s as any),
        createdBy: ownerId,
      } as any);
    }

    return { inserted: samples.length };
  },
});