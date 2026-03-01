import { Client } from '@notionhq/client'

let _client: Client | null = null

/** 노션 API 클라이언트 싱글톤 — 서버 사이드 전용, 지연 초기화 */
export function getNotionClient(): Client {
  if (_client) return _client

  if (!process.env.NOTION_API_KEY) {
    throw new Error('환경변수 NOTION_API_KEY가 설정되지 않았습니다.')
  }

  _client = new Client({ auth: process.env.NOTION_API_KEY })
  return _client
}
