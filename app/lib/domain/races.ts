export const Races = [
  'Human (Solomani)',
  'Human (Vilani)',
  'Zhodani (Human)',
  'Aslan (major)',
  'Vargr (major)',
  'Droyne (minor)',
  'Chirper (minor)',
  'Vegan (minor)',
] as const;

export type Race = (typeof Races)[number];
