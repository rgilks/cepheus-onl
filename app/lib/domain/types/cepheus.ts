import { z } from 'zod';

export const CepheusSkillSchema = z.object({
  name: z.string(),
  level: z.number().int(),
});
export type CepheusSkill = z.infer<typeof CepheusSkillSchema>;

export const CepheusCareerSchema = z.object({
  name: z.string(),
  assignment: z.string().optional(),
  status: z.string(),
  terms: z.number().int(),
  skills: z.array(CepheusSkillSchema),
  benefits: z.array(z.string()),
  rank: z.string(),
});
export type CepheusCareer = z.infer<typeof CepheusCareerSchema>;

export const AICareerSchema = z.object({
  name: z.string(),
  terms: z.number().int(),
});
export type AICareer = z.infer<typeof AICareerSchema>;

export const AIGeneratedCharacterSchema = z.object({
  name: z.string(),
  upp: z.string(),
  age: z.number().int(),
  careers: z.array(AICareerSchema),
  credits: z.number().int(),
  skills: z.array(CepheusSkillSchema),
  speciesTraits: z.array(z.string()).nullable().optional(),
  equipment: z.array(z.string()).nullable().optional(),
  backstory: z.string().optional(),
});
export type AIGeneratedCharacter = z.infer<typeof AIGeneratedCharacterSchema>;

export const CepheusSchema = z.object({
  name: z.string(),
  upp: z.string(),
  age: z.number().int(),
  gender: z.string(),
  characteristics: z.object({
    str: z.number().int(),
    dex: z.number().int(),
    end: z.number().int(),
    int: z.number().int(),
    edu: z.number().int(),
    soc: z.number().int(),
  }),
  homeworld: z.string(),
  careers: z.array(CepheusCareerSchema),
  skills: z.array(CepheusSkillSchema),
  equipment: z.array(z.string()).nullable().optional(),
  credits: z.number().int(),
  speciesTraits: z.array(z.string()).nullable().optional(),
  backstory: z.string().optional(),
});
export type Cepheus = z.infer<typeof CepheusSchema>;
