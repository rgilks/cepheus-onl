import { z } from 'zod';

export const EquipmentItemSchema = z
  .object({
    Name: z.string(),
    Description: z.string().optional(),
  })
  .passthrough();
export type EquipmentItem = z.infer<typeof EquipmentItemSchema>;

export const DieRollSchema = z.object({
  sides: z.number().int(),
  quantity: z.number().int(),
  modifier: z.number().int(),
  result: z.number().int(),
});
export type DieRoll = z.infer<typeof DieRollSchema>;

export const PresenceSchema = z.object({
  id: z.string(),
  lastSeen: z.date(),
  characterID: z.string().optional(),
});
export type Presence = z.infer<typeof PresenceSchema>;

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  tl: z.number().int().optional(),
  cost: z.number().optional(),
  wgt: z.number().optional(),
  rof: z.string().optional(),
  range: z.string().optional(),
  dmg: z.string().optional(),
  type: z.string().optional(),
  recoil: z.boolean().optional(),
  ll: z.number().int().optional(),
  description: z.string().optional(),
  rating: z.number().int().optional(),
  ar: z.number().int().optional(),
  laserAR: z.number().int().optional(),
  skill: z.string().optional(),
  radius: z.string().optional(),
  rounds: z.number().int().optional(),
  quantity: z.number().int().optional(),
  carried: z.boolean().optional(),
  location: z.string().optional(),
  traits: z.record(z.unknown()).optional(),
  magazine: z.number().int().optional(),
  magazineCost: z.number().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const AnimalDataSchema = z.object({
  size: z.number().optional(),
  subType: z.string().optional(),
  type: z.string().optional(),
  terrain: z.string().optional(),
  locomotion: z.string().optional(),
  speed: z.number().optional(),
});
export type AnimalData = z.infer<typeof AnimalDataSchema>;

export const LedgerEntrySchema = z.object({
  reference: z.string(),
  createdAt: z.date(),
  credits: z.number(),
});
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;

export const ModifierSchema = z.object({
  label: z.string(),
  dm: z.number().int(),
});
export type Modifier = z.infer<typeof ModifierSchema>;

export const DieRollResultSchema = z.object({
  action: z.string().optional(),
  check: z.string().optional(),
  rawScore: z.number().int().optional(),
  score: z.number().int().optional(),
  dm: z.number().int().optional(),
  d6: z.number().int().optional(),
  details: z.record(z.unknown()).optional(),
  modifiers: z.array(ModifierSchema).optional(),
  createdAt: z.date().optional(),
});
export type DieRollResult = z.infer<typeof DieRollResultSchema>;
