import { z } from 'zod';

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
  Name: z.string(),
  Description: z.string().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const EquipmentItemSchema = ItemSchema.extend({
  Name: z.string(),
  Description: z.string().optional(),
});
export type EquipmentItem = z.infer<typeof EquipmentItemSchema>;

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

export const CombatStateSchema = z.object({
  stance: z.string().optional(),
  aim: z.number().int().optional(),
  grappled: z.boolean().optional(),
  fatigued: z.boolean().optional(),
  cover: z.number().int().optional(),
  characteristics: CharacteristicsSchema.optional(),
  unconscious: z.boolean().optional(),
  armor: z.string().optional(),
  AR: z.string().optional(),
  group: z.string().optional(),
  target: z.string().optional(),
  aware: z.boolean().optional(),
  dodge: z.boolean().optional(),
  parry: z.boolean().optional(),
  reactions: z.number().int().optional(),
  weapon: z.string().optional(),
  modifiers: z.array(ModifierSchema).optional(),
  lastDieRollResult: DieRollResultSchema.optional(),
});
export type CombatState = z.infer<typeof CombatStateSchema>;

export const PieceSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
  image: z.string().optional(),
  boardID: z.string(),
  gameID: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  characterID: z.string().optional(),
  owner: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  scale: z.number().optional(),
  targets: z.array(z.string()).optional(),
  selectedBy: z.array(z.string()).optional(),
  visibility: z.string().optional(),
  freedom: z.string().optional(),
  combatState: CombatStateSchema.optional(),
  name: z.string().optional(),
});
export type Piece = z.infer<typeof PieceSchema>;

export const InitiativeSchema = z.object({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  owner: z.string().optional(),
  characterID: z.string().optional(),
  pieceID: z.string().optional(),
  gameID: z.string(),
  boardID: z.string().optional(),
  roundStart: z.boolean().optional(),
});
export type Initiative = z.infer<typeof InitiativeSchema>;

export const BoardSchema = z.object({
  id: z.string(),
  image: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  scale: z.number().optional(),
  gameID: z.string(),
  owner: z.string().optional(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  boardInitiativeId: z.string().optional(),
  url: z.string().optional(),
});
export type Board = z.infer<typeof BoardSchema>;

export const DieRollSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  owner: z.string(),
  updatedAt: z.date(),
  gameID: z.string(),
  characterID: z.string().optional(),
  result: DieRollResultSchema,
  pieceID: z.string().optional(),
});
export type DieRoll = z.infer<typeof DieRollSchema>;

export const PresenceSchema = z.object({
  id: z.string(),
  owner: z.string(),
  time: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  left: z.boolean().optional(),
  gameID: z.string(),
});
export type Presence = z.infer<typeof PresenceSchema>;

export const DiscordMessageSchema = z.object({
  message: z.string().min(1, 'Message is required.'),
});

export const CepheusCareerSchema = z.object({
  name: z.string(),
  terms: z.number().int().positive(),
});
export type CepheusCareer = z.infer<typeof CepheusCareerSchema>;

export const CepheusSkillSchema = z.object({
  name: z.string(),
  level: z.number().int().min(0),
});
export type CepheusSkill = z.infer<typeof CepheusSkillSchema>;

export const CepheusSchema = z.object({
  name: z.string(),
  upp: z
    .string()
    .length(6)
    .regex(/^[0-9A-F]+$/),
  age: z.number().int().positive(),
  careers: z.array(CepheusCareerSchema),
  credits: z.number().int().min(0),
  skills: z.array(CepheusSkillSchema),
  speciesTraits: z
    .array(z.string())
    .nullish()
    .transform(val => val ?? undefined),
  equipment: z
    .array(z.string())
    .nullish()
    .transform(val => val ?? undefined),
  backstory: z.string(),
});

export type Cepheus = z.infer<typeof CepheusSchema>;
