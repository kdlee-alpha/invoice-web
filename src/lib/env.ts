import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  /** 노션 통합 시크릿 키 (서버 사이드 전용) */
  NOTION_API_KEY: z.string().optional(),
  /** 노션 데이터베이스 ID */
  NOTION_DATABASE_ID: z.string().optional(),
  /** 배포 도메인 URL */
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
})

export type Env = z.infer<typeof envSchema>
