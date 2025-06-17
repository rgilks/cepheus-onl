export const Races = [
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
] as const;

export type Race = (typeof Races)[number];
