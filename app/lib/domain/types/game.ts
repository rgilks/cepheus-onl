import { z } from 'zod';

export const RulesetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  data: z.record(z.unknown()),
});
export type Ruleset = z.infer<typeof RulesetSchema>;

export const GameSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  slug: z.string(),
  owner: z.string(),
  allowSpectators: z.boolean().optional(),
  allowCharacterDelete: z.boolean().optional(),
  maxCharactersPerPlayer: z.number().int().optional(),
  gameSelectedBoardId: z.string().optional(),
  allowCharacterImport: z.boolean().optional(),
  restrictMovement: z.boolean().optional(),
  rulesetID: z.string(),
});
export type Game = z.infer<typeof GameSchema>;

export const WorldSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().int().optional(),
  hydrographics: z.number().int().optional(),
  population: z.number().int().optional(),
  primaryStarport: z.string().optional(),
  government: z.number().int().optional(),
  lawLevel: z.number().int().optional(),
  techLevel: z.number().int().optional(),
  tradeCodes: z.string().optional(),
  atmosphere: z.number().int().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  gameID: z.string(),
});
export type World = z.infer<typeof WorldSchema>;

export const PlayerSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  owner: z.string(),
  gameID: z.string(),
});
export type Player = z.infer<typeof PlayerSchema>;
