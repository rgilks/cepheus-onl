import { integer, sqliteTable, text, primaryKey, real } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { nanoid } from 'nanoid';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

export const accounts = sqliteTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('sessions', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const rulesets = sqliteTable('rulesets', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  owner: text('owner').references(() => users.id),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  data: text('data', { mode: 'json' }).notNull(),
});

export const games = sqliteTable('games', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  owner: text('owner')
    .notNull()
    .references(() => users.id),
  rulesetID: text('rulesetID')
    .notNull()
    .references(() => rulesets.id),
  gameSelectedBoardId: text('gameSelectedBoardId'),
  allowSpectators: integer('allowSpectators', { mode: 'boolean' }).default(false),
  allowCharacterDelete: integer('allowCharacterDelete', { mode: 'boolean' }).default(false),
  maxCharactersPerPlayer: integer('maxCharactersPerPlayer').default(1),
  allowCharacterImport: integer('allowCharacterImport', { mode: 'boolean' }).default(false),
  restrictMovement: integer('restrictMovement', { mode: 'boolean' }).default(false),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const worlds = sqliteTable('worlds', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  size: integer('size'),
  hydrographics: integer('hydrographics'),
  population: integer('population'),
  primaryStarport: text('primaryStarport'),
  government: integer('government'),
  lawLevel: integer('lawLevel'),
  techLevel: integer('techLevel'),
  tradeCodes: text('tradeCodes'),
  atmosphere: integer('atmosphere'),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const players = sqliteTable('players', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  owner: text('owner')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const boards = sqliteTable('boards', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name'),
  image: text('image'),
  url: text('url'),
  width: integer('width'),
  height: integer('height'),
  scale: real('scale'),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  owner: text('owner').references(() => users.id),
  boardInitiativeId: text('boardInitiativeId'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const initiatives = sqliteTable('initiatives', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  owner: text('owner'),
  characterID: text('characterID'),
  pieceID: text('pieceID'),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  boardID: text('boardID').references(() => boards.id, { onDelete: 'set null' }),
  roundStart: integer('roundStart', { mode: 'boolean' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const characters = sqliteTable('characters', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  characteristics: text('characteristics', { mode: 'json' }).notNull(),
  skills: text('skills', { mode: 'json' }).notNull(),
  homeWorld: text('homeWorld', { mode: 'json' }),
  terms: text('terms', { mode: 'json' }).notNull(),
  careers: text('careers', { mode: 'json' }).notNull(),
  backgroundSkills: text('backgroundSkills', { mode: 'json' }).notNull(),
  image: text('image'),
  cascadeSkills: text('cascadeSkills', { mode: 'json' }).notNull(),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  owner: text('owner')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  canEnterDraft: integer('canEnterDraft', { mode: 'boolean' }).notNull(),
  credits: real('credits').notNull(),
  failedToQualify: integer('failedToQualify', { mode: 'boolean' }).notNull(),
  creationComplete: integer('creationComplete', { mode: 'boolean' }).notNull(),
  characteristicChanges: text('characteristicChanges', { mode: 'json' }).notNull(),
  displayTitle: integer('displayTitle', { mode: 'boolean' }).notNull(),
  materialBenefits: text('materialBenefits', { mode: 'json' }).notNull(),
  lastDieRollResult: text('lastDieRollResult', { mode: 'json' }),
  equipment: text('equipment', { mode: 'json' }).notNull(),
  startingCredits: real('startingCredits'),
  notes: text('notes'),
  animalData: text('animalData', { mode: 'json' }),
  type: text('type'),
  description: text('description'),
  traits: text('traits'),
  price: real('price'),
  hull: integer('hull'),
  structure: integer('structure'),
  initiative: integer('initiative'),
  haste: integer('haste', { mode: 'boolean' }),
  delay: integer('delay', { mode: 'boolean' }),
  reactions: integer('reactions'),
  active: integer('active', { mode: 'boolean' }),
  initialPurchaseComplete: integer('initialPurchaseComplete', { mode: 'boolean' }),
  ledger: text('ledger', { mode: 'json' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const generatedCharacters = sqliteTable('generated_characters', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  upp: text('upp').notNull(),
  age: integer('age').notNull(),
  careers: text('careers', { mode: 'json' }).notNull(),
  credits: integer('credits').notNull(),
  skills: text('skills', { mode: 'json' }).notNull(),
  speciesTraits: text('speciesTraits', { mode: 'json' }),
  equipment: text('equipment', { mode: 'json' }),
  backstory: text('backstory'),
  r2_image_key: text('r2_image_key'),
  location_image_key: text('location_image_key'),
  location: text('location', { mode: 'json' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const pieces = sqliteTable('pieces', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  x: real('x').notNull(),
  y: real('y').notNull(),
  z: real('z'),
  image: text('image'),
  boardID: text('boardID')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  width: real('width'),
  height: real('height'),
  characterID: text('characterID').references(() => characters.id, { onDelete: 'set null' }),
  owner: text('owner').references(() => users.id, { onDelete: 'set null' }),
  scale: real('scale'),
  targets: text('targets', { mode: 'json' }),
  selectedBy: text('selectedBy', { mode: 'json' }),
  visibility: text('visibility'),
  freedom: text('freedom'),
  combatState: text('combatState', { mode: 'json' }),
  name: text('name'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const dieRolls = sqliteTable('dieRolls', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  owner: text('owner')
    .notNull()
    .references(() => users.id),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  characterID: text('characterID').references(() => characters.id, { onDelete: 'set null' }),
  pieceID: text('pieceID').references(() => pieces.id, { onDelete: 'set null' }),
  result: text('result', { mode: 'json' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const presences = sqliteTable('presences', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  owner: text('owner')
    .notNull()
    .references(() => users.id),
  gameID: text('gameID')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  time: real('time').notNull(),
  left: integer('left', { mode: 'boolean' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
  games: many(games),
  characters: many(characters),
}));

export const rulesetsRelations = relations(rulesets, ({ many }) => ({
  games: many(games),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  ruleset: one(rulesets, {
    fields: [games.rulesetID],
    references: [rulesets.id],
  }),
  owner: one(users, {
    fields: [games.owner],
    references: [users.id],
  }),
  characters: many(characters),
  worlds: many(worlds),
  players: many(players),
  boards: many(boards),
  pieces: many(pieces),
  dieRolls: many(dieRolls),
  initiatives: many(initiatives),
  presences: many(presences),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  game: one(games, {
    fields: [characters.gameID],
    references: [games.id],
  }),
  owner: one(users, {
    fields: [characters.owner],
    references: [users.id],
  }),
  pieces: many(pieces),
  dieRolls: many(dieRolls),
}));

export const worldsRelations = relations(worlds, ({ one }) => ({
  game: one(games, {
    fields: [worlds.gameID],
    references: [games.id],
  }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  game: one(games, {
    fields: [players.gameID],
    references: [games.id],
  }),
  user: one(users, {
    fields: [players.owner],
    references: [users.id],
  }),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  game: one(games, {
    fields: [boards.gameID],
    references: [games.id],
  }),
  pieces: many(pieces),
}));

export const piecesRelations = relations(pieces, ({ one }) => ({
  game: one(games, {
    fields: [pieces.gameID],
    references: [games.id],
  }),
  board: one(boards, {
    fields: [pieces.boardID],
    references: [boards.id],
  }),
  character: one(characters, {
    fields: [pieces.characterID],
    references: [characters.id],
  }),
}));

export const dieRollsRelations = relations(dieRolls, ({ one }) => ({
  game: one(games, {
    fields: [dieRolls.gameID],
    references: [games.id],
  }),
  character: one(characters, {
    fields: [dieRolls.characterID],
    references: [characters.id],
  }),
}));

export const initiativesRelations = relations(initiatives, ({ one }) => ({
  game: one(games, {
    fields: [initiatives.gameID],
    references: [games.id],
  }),
}));

export const presencesRelations = relations(presences, ({ one }) => ({
  game: one(games, {
    fields: [presences.gameID],
    references: [games.id],
  }),
  user: one(users, {
    fields: [presences.owner],
    references: [users.id],
  }),
}));
