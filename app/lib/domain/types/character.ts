import { z } from 'zod';
import { AnimalDataSchema, DieRollResultSchema, ItemSchema, LedgerEntrySchema } from './common';

export const RaceSchema = z.enum([
  // Major Races
  'Human (Solomani)',
  'Human (Vilani)',
  'Zhodani (Human)',
  'Aslan (major)',
  'Vargr (major)',
  'Droyne (major)',

  // Minor Races (Humaniti & Variants)
  'Darrian (Humaniti)',
  'Nexies (Human Variant) (minor)',

  // Minor Races (Non-Human)
  'Amindii (minor)',
  'Chirper (minor)',
  'Chokari (minor)',
  'Crawni (minor)',
  'Ebokin (minor)',
  'Larianz (minor)',
  'Llellewyloly (Dandelions) (minor)',
  'Shriekers (minor)',
  'Tentrassi (minor)',
  'Vegan (minor)',
]);

export type Race = z.infer<typeof RaceSchema>;

export const Races = RaceSchema.options;

export const CharacteristicsSchema = z.object({
  str: z.number().int().default(0),
  dex: z.number().int().default(0),
  end: z.number().int().default(0),
  int: z.number().int().default(0),
  edu: z.number().int().default(0),
  soc: z.number().int().default(0),
  psi: z.number().int().optional(),
  instinct: z.number().int().optional(),
  pack: z.number().int().optional(),
});
export type Characteristics = z.infer<typeof CharacteristicsSchema>;

export const HomeWorldSchema = z.object({
  name: z.string().optional(),
  lawLevel: z.string().optional(),
  tradeCodes: z.string().optional(),
});
export type HomeWorld = z.infer<typeof HomeWorldSchema>;

export const AgeingEffectSchema = z.object({
  characteristic: z.string(),
  modifier: z.number().int(),
});
export type AgeingEffect = z.infer<typeof AgeingEffectSchema>;

export const PromotionSchema = z.object({
  skill: z.string().optional(),
  bonusSkill: z.string().optional(),
  rank: z.string().optional(),
  roll: z.number().int().optional(),
});
export type Promotion = z.infer<typeof PromotionSchema>;

export const TermSchema = z.object({
  career: z.string(),
  skills: z.array(z.string()),
  survival: z.number().int().optional(),
  mishap: z.number().int().optional(),
  commission: PromotionSchema.optional(),
  advancement: PromotionSchema.optional(),
  draft: z.number().int().optional(),
  reEnlistment: z.number().int().optional(),
  benefits: z.array(z.string()),
  skillsAndTraining: z.array(z.string()),
  complete: z.boolean(),
  canReenlist: z.boolean(),
  completedBasicTraining: z.boolean(),
  musteringOut: z.boolean(),
  rank: z.string().optional(),
  ageingEffects: z.array(AgeingEffectSchema),
  anagathics: z.boolean(),
  anagathicsCost: z.number().int(),
});
export type Term = z.infer<typeof TermSchema>;

export const CareerSchema = z.object({
  name: z.string(),
  rank: z.number().int(),
});
export type Career = z.infer<typeof CareerSchema>;

export const CharacteristicChangeSchema = z.object({
  type: z.string(),
  modifier: z.number().int(),
});
export type CharacteristicChange = z.infer<typeof CharacteristicChangeSchema>;

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().int(),
  gender: z.string(),
  characteristics: CharacteristicsSchema,
  skills: z.array(z.string()),
  createdAt: z.date(),
  homeWorld: HomeWorldSchema.optional(),
  terms: z.array(TermSchema),
  careers: z.array(CareerSchema),
  backgroundSkills: z.array(z.string()),
  updatedAt: z.date(),
  image: z.string().optional(),
  cascadeSkills: z.array(z.string()),
  gameID: z.string(),
  owner: z.string(),
  canEnterDraft: z.boolean(),
  credits: z.number(),
  failedToQualify: z.boolean(),
  creationComplete: z.boolean(),
  characteristicChanges: z.array(CharacteristicChangeSchema),
  displayTitle: z.boolean(),
  materialBenefits: z.array(z.string()),
  lastDieRollResult: DieRollResultSchema.optional(),
  equipment: z.array(ItemSchema),
  startingCredits: z.number().optional(),
  notes: z.string().optional(),
  animalData: AnimalDataSchema.optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  traits: z.string().optional(),
  price: z.number().optional(),
  hull: z.number().int().optional(),
  structure: z.number().int().optional(),
  initiative: z.number().int().optional(),
  haste: z.boolean().optional(),
  delay: z.boolean().optional(),
  reactions: z.number().int().optional(),
  active: z.boolean().optional(),
  initialPurchaseComplete: z.boolean().optional(),
  ledger: z.array(LedgerEntrySchema).optional(),
});
export type Character = z.infer<typeof CharacterSchema>;
