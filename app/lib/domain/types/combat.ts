import { z } from 'zod';
import { CharacteristicsSchema } from './character';
import { ItemSchema } from './common';

export const CombatStateSchema = z.object({
  stance: z.string().optional(),
  aim: z.number().int().optional(),
  grappled: z.boolean().optional(),
  fatigued: z.boolean().optional(),
  cover: z.number().int().optional(),
  characteristics: CharacteristicsSchema.optional(),
  unconscious: z.boolean().optional(),
  wounds: z.number().int().optional(),
  encumbrance: z.number().int().optional(),
  movement: z.number().int().optional(),
  actions: z.number().int().optional(),
  currentWeapon: z.string().optional(),
});
export type CombatState = z.infer<typeof CombatStateSchema>;

export const PieceSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  label: z.string(),
  characterID: z.string(),
  image: z.string().optional(),
  size: z.number().int().optional(),
  combatState: CombatStateSchema.optional(),
  boardID: z.string(),
  owner: z.string(),
  type: z.string(),
  items: z.array(ItemSchema).optional(),
});
export type Piece = z.infer<typeof PieceSchema>;

export const InitiativeSchema = z.object({
  id: z.string(),
  score: z.number().int(),
  characterID: z.string(),
  boardID: z.string(),
});
export type Initiative = z.infer<typeof InitiativeSchema>;

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  gameID: z.string(),
  backgroundImage: z.string().optional(),
  gridColor: z.string().optional(),
  gridSize: z.number().int().optional(),
  gridOpacity: z.number().optional(),
  pieces: z.array(PieceSchema).optional(),
  initiative: z.array(InitiativeSchema).optional(),
});
export type Board = z.infer<typeof BoardSchema>;
