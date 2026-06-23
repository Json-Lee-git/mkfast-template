import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "@/db";
import { checkerSubmissions } from "@/db/app.schema";

const schema = z.object({
  brandName: z.string().min(1),
  websiteUrl: z.string().min(1),
  industry: z.string().optional().default(""),
  competitors: z.string().optional().default(""),
  email: z.string().email(),
  platforms: z.array(z.string()),
  role: z.string().optional().default(""),
});

export const submitCheckerForm = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const db = getDb();
    await db.insert(checkerSubmissions).values({
      brandName: data.brandName.trim(),
      websiteUrl: data.websiteUrl.trim(),
      industry: data.industry?.trim() || "",
      competitors: data.competitors?.trim() || "",
      email: data.email.trim(),
      platforms: JSON.stringify(data.platforms),
      role: data.role || "",
      submittedAt: new Date().toISOString(),
    });
    return { success: true };
  });
