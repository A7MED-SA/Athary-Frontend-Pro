import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('https://atharyapi.runasp.net/api/v1'),
  VITE_SIGNALR_URL: z.string().url().default('wss://atharyapi.runasp.net'),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  VITE_MICROSOFT_CLIENT_ID: z.string().min(1, 'Microsoft Client ID is required'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
