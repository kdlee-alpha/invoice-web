import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Invoice, InvoiceItem } from '@/types/invoice'

/** 노션 페이지 응답을 Invoice 객체로 변환 */
export function parseNotionPageToInvoice(page: PageObjectResponse): Invoice {
  const props = page.properties

  // Title 타입 파싱
  const projectName =
    props['프로젝트명']?.type === 'title'
      ? props['프로젝트명'].title.map(t => t.plain_text).join('')
      : '제목 없음'

  // Rich Text 타입 파싱 — 품목 목록 JSON 파싱
  const itemsRaw =
    props['품목_목록']?.type === 'rich_text'
      ? props['품목_목록'].rich_text.map(t => t.plain_text).join('')
      : '[]'

  let items: InvoiceItem[] = []
  try {
    items = JSON.parse(itemsRaw) as InvoiceItem[]
  } catch {
    items = []
  }

  // Date 타입 파싱
  const issuedAt =
    props['발행일']?.type === 'date'
      ? (props['발행일'].date?.start ?? new Date().toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0]

  // Files & Media 타입 — 로고 URL 파싱
  const logoUrl =
    props['로고_이미지']?.type === 'files' &&
    props['로고_이미지'].files.length > 0
      ? props['로고_이미지'].files[0].type === 'file'
        ? props['로고_이미지'].files[0].file.url
        : props['로고_이미지'].files[0].type === 'external'
          ? props['로고_이미지'].files[0].external.url
          : undefined
      : undefined

  return {
    id: page.id,
    projectName,
    invoiceNumber:
      props['견적번호']?.type === 'rich_text'
        ? props['견적번호'].rich_text.map(t => t.plain_text).join('') ||
          undefined
        : undefined,
    issuedAt,
    validUntil:
      props['유효기간']?.type === 'date'
        ? (props['유효기간'].date?.start ?? undefined)
        : undefined,
    sender: {
      companyName:
        props['발신자_회사명']?.type === 'rich_text'
          ? props['발신자_회사명'].rich_text.map(t => t.plain_text).join('')
          : '',
      email:
        props['발신자_이메일']?.type === 'email'
          ? (props['발신자_이메일'].email ?? undefined)
          : undefined,
      phone:
        props['발신자_연락처']?.type === 'phone_number'
          ? (props['발신자_연락처'].phone_number ?? undefined)
          : undefined,
      logoUrl,
    },
    receiver: {
      companyName:
        props['수신자_회사명']?.type === 'rich_text'
          ? props['수신자_회사명'].rich_text.map(t => t.plain_text).join('')
          : '',
      contactName:
        props['수신자_담당자']?.type === 'rich_text'
          ? props['수신자_담당자'].rich_text.map(t => t.plain_text).join('') ||
            undefined
          : undefined,
    },
    items,
    taxRate:
      props['세율']?.type === 'number' ? (props['세율'].number ?? 10) : 10,
    memo:
      props['메모']?.type === 'rich_text'
        ? props['메모'].rich_text.map(t => t.plain_text).join('') || undefined
        : undefined,
    status:
      props['상태']?.type === 'select'
        ? ((props['상태'].select?.name ?? 'draft') as Invoice['status'])
        : 'draft',
  }
}
