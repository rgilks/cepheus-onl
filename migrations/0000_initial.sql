-- In this file, you can define your database schema using SQL.
-- For example:
-- CREATE TABLE users (
--   id INT PRIMARY KEY,
--   name TEXT
-- );
-- For Cepheus Engine, we might start with something like this:
-- Cepheus Engine Online - Initial Schema
-- Based on the GraphQL schema provided.
-- CLeanup from previous attempts
DROP TABLE IF EXISTS characters;

-- Core table for games
CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    slug TEXT UNIQUE,
    owner TEXT,
    ruleset_id TEXT,
    game_selected_board_id TEXT,
    allow_spectators INTEGER,
    allow_character_delete INTEGER,
    allow_character_import INTEGER,
    max_characters_per_player INTEGER,
    restrict_movement INTEGER
);

CREATE INDEX IF NOT EXISTS idx_games_owner ON games(owner);

CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

CREATE INDEX IF NOT EXISTS idx_games_ruleset_id ON games(ruleset_id);

-- Users associated with a game
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    owner TEXT,
    -- The user's own ID
    game_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_players_owner ON players(owner);

CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);

-- Characters
CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    gender TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    game_id TEXT,
    owner TEXT,
    credits REAL,
    description TEXT,
    traits TEXT,
    price REAL,
    hull INTEGER,
    structure INTEGER,
    initiative INTEGER,
    reactions INTEGER,
    active INTEGER,
    notes TEXT,
    -- JSON text fields for complex data
    characteristics TEXT,
    skills TEXT,
    home_world TEXT,
    terms TEXT,
    careers TEXT,
    background_skills TEXT,
    cascade_skills TEXT,
    characteristic_changes TEXT,
    material_benefits TEXT,
    last_die_roll_result TEXT,
    equipment TEXT,
    animal_data TEXT,
    ledger TEXT,
    -- Booleans
    display_title INTEGER,
    can_enter_draft INTEGER,
    failed_to_qualify INTEGER,
    creation_complete INTEGER,
    initial_purchase_complete INTEGER,
    haste INTEGER,
    delay INTEGER,
    -- Not in schema but useful
    type TEXT
);

CREATE INDEX IF NOT EXISTS idx_characters_game_id ON characters(game_id);

-- Worlds within a game
CREATE TABLE IF NOT EXISTS worlds (
    id TEXT PRIMARY KEY,
    name TEXT,
    size INTEGER,
    hydrographics INTEGER,
    population INTEGER,
    primary_starport TEXT,
    government INTEGER,
    law_level INTEGER,
    tech_level INTEGER,
    trade_codes TEXT,
    atmosphere INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    game_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_worlds_game_id ON worlds(game_id);

-- Game boards/maps
CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    name TEXT,
    image TEXT,
    url TEXT,
    width INTEGER,
    height INTEGER,
    scale REAL,
    game_id TEXT,
    owner TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_boards_game_id ON boards(game_id);

-- Pieces/tokens on a board
CREATE TABLE IF NOT EXISTS pieces (
    id TEXT PRIMARY KEY,
    x REAL,
    y REAL,
    z REAL,
    image TEXT,
    board_id TEXT,
    game_id TEXT,
    character_id TEXT,
    width REAL,
    height REAL,
    scale REAL,
    owner TEXT,
    name TEXT,
    visibility TEXT,
    freedom TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    -- JSON text fields for complex data
    targets TEXT,
    selected_by TEXT,
    combat_state TEXT
);

CREATE INDEX IF NOT EXISTS idx_pieces_board_id ON pieces(board_id);

CREATE INDEX IF NOT EXISTS idx_pieces_game_id ON pieces(game_id);

CREATE INDEX IF NOT EXISTS idx_pieces_character_id ON pieces(character_id);

-- Game rulesets
CREATE TABLE IF NOT EXISTS rulesets (
    id TEXT PRIMARY KEY,
    owner TEXT,
    name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    data TEXT -- JSON object for the ruleset data
);

-- Initiative tracking for combat
CREATE TABLE IF NOT EXISTS initiatives (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    owner TEXT,
    character_id TEXT,
    piece_id TEXT,
    game_id TEXT,
    board_id TEXT,
    round_start INTEGER
);

CREATE INDEX IF NOT EXISTS idx_initiatives_game_id ON initiatives(game_id);

-- User presence in a game
CREATE TABLE IF NOT EXISTS presences (
    id TEXT PRIMARY KEY,
    owner TEXT,
    time REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    left INTEGER,
    game_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_presences_game_id ON presences(game_id);

-- Records of die rolls
CREATE TABLE IF NOT EXISTS die_rolls (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    owner TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    game_id TEXT,
    character_id TEXT,
    piece_id TEXT,
    result TEXT -- JSON object for the DieRollResult type
);

CREATE INDEX IF NOT EXISTS idx_die_rolls_game_id ON die_rolls(game_id);

CREATE INDEX IF NOT EXISTS idx_die_rolls_character_id ON die_rolls(character_id);