import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { getNotionClient } from './client'
import { parseNotionPageToInvoice } from './parser'
import type { Invoice } from '@/types/invoice'

/** 노션 페이지 ID로 견적서 데이터 조회 (60초 캐싱) */
export const getInvoiceById = unstable_cache(
  async (pageId: string): Promise<Invoice> => {
    const page = await getNotionClient().pages.retrieve({ page_id: pageId })

    if (page.object !== 'page') {
      throw new Error('유효하지 않은 노션 페이지입니다.')
    }

    return parseNotionPageToInvoice(page as PageObjectResponse)
  },
  ['invoice'],
  { revalidate: 60 }
)
