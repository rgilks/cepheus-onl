import { z } from 'zod';

export const CepheusSchema = z.object({
  name: z.string().describe('The full name of the character, including any titles.'),
  upp: z
    .string()
    .length(6)
    .regex(/^[0-9A-F]+$/)
    .describe('The Universal Personality Profile of the character.'),
  age: z.number().int().positive().describe('The age of the character in years.'),
  careers: z
    .array(
      z.object({
        name: z.string().describe('The name of the career.'),
        terms: z.number().int().positive().describe('The number of terms served in the career.'),
      })
    )
    .describe('A list of careers the character has had.'),
  credits: z.number().int().min(0).describe('The amount of credits the character possesses.'),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.number().int().min(0),
      })
    )
    .describe('A list of skills the character has, with their corresponding levels.'),
  speciesTraits: z.array(z.string()).optional().describe('A list of traits for non-human species.'),
  equipment: z
    .array(z.string())
    .optional()
    .describe('A list of significant equipment the character owns.'),
  backstory: z
    .string()
    .describe(
      'A short, engaging backstory for the character, suitable for a Cepheus Engine RPG setting.'
    ),
});

export type Cepheus = z.infer<typeof CepheusSchema>;
