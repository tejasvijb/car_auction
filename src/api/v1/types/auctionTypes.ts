import z from "zod";

export const loginSchema = z.object({
  password: z.string().min(4),
  username: z.string().min(4),
});

export const auctionStatusEnum = z.enum(["active", "cancelled", "ended", "upcoming"]);

export type LoginType = z.infer<typeof loginSchema>;
