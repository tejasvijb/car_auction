import z from "zod";

export const loginSchema = z.object({
  password: z.string().min(4),
  username: z.string().min(4),
});

export type LoginType = z.infer<typeof loginSchema>;
