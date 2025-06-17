import { z } from 'zod';

export const travellerWorldSchema = z.object({
  Name: z.string(),
  Hex: z.string(),
  UWP: z.string(),
  Bases: z.string().optional(),
  Remarks: z.string().optional(),
  Zone: z.string().optional(),
  PBG: z.string(),
  Allegiance: z.string(),
  Stellar: z.string(),
  Ix: z.string(),
  Ex: z.string(),
  Cx: z.string(),
  Nobility: z.string().optional(),
  Worlds: z.number().optional(),
  Sector: z.string(),
});

export const jumpWorldsResponseSchema = z.object({
  Worlds: z.array(travellerWorldSchema),
});

export const sectorWorldsResponseSchema = z.object({
  Worlds: z.array(travellerWorldSchema),
});

export type TravellerWorld = z.infer<typeof travellerWorldSchema>;
