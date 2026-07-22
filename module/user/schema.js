import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),

    email: z.string().email(),

    password: z.string().min(8).max(100),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),

    password: z.string().min(8),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});
