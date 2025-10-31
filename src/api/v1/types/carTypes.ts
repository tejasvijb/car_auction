import z from "zod";

export const carAuctionInputFields = z
  .object({
    carId: z.uuid(),
    endTime: z.preprocess((val) => new Date(val as string), z.date()),
    startingPrice: z.number().min(0),
    startTime: z.preprocess((val) => new Date(val as string), z.date()),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

export type ICarAuctionInput = z.infer<typeof carAuctionInputFields>;
