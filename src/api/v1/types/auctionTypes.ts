import z from "zod";

export const loginSchema = z.object({
  password: z.string().min(4),
  username: z.string().min(4),
});

export const auctionStatusEnum = z.enum(["active", "cancelled", "ended", "upcoming"]);

export const placeBidSchema = z.object({
  auctionId: z.uuid(),
  bidAmount: z.number().positive(),
  dealerId: z.uuid(),
});

export type LoginType = z.infer<typeof loginSchema>;
export type PlaceBidType = z.infer<typeof placeBidSchema>;
