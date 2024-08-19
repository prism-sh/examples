import { z } from 'zod'

export const agentFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(100, {
      message: 'Username must not be longer than 100 characters.',
    }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  prompt: z
    .string()
    .max(640, {
      message: 'Prompt must not be longer than 640 characters.',
    })
    .min(4, {
      message: 'Prompt must be at least 4 characters.',
    }),
  contexts: z.array(z.string()).optional(),
  auth_enabled: z.boolean().optional(),
  addons: z
    .object({
      agent_wallet: z.boolean(),
    })
    .optional(),
})

export type AgentFormValues = z.infer<typeof agentFormSchema>

export const agentPlaygroundSchema = z.object({
  message: z
    .string()
    .min(2, { message: 'Minimum 3 characters.' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
  tools: z.array(z.string()).default([]),
})

export type AgentPlaygroundValues = z.infer<typeof agentPlaygroundSchema>
