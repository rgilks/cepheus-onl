import { z } from 'zod';

export const CepheusSchema = z.object({
  name: z.string(),
  upp: z
    .string()
    .length(6)
    .regex(/^[0-9A-F]+$/),
  age: z.number().int().positive(),
  careers: z.array(
    z.object({
      name: z.string(),
      terms: z.number().int().positive(),
    })
  ),
  credits: z.number().int().min(0),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.number().int().min(0),
    })
  ),
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
