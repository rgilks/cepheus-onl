import { z } from 'zod';

export const travellerWorldSchema = z.object({
  Name: z.string().optional(),
  Hex: z.string(),
  UWP: z.string().optional(),
  Bases: z.string().optional(),
  Remarks: z.string().optional(),
  Zone: z.string().optional(),
  PBG: z.string().optional(),
  Allegiance: z.string().optional(),
  Stellar: z.string().optional(),
  Ix: z.string().optional(),
  Ex: z.string().optional(),
  Cx: z.string().optional(),
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
