import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceById } from '@/lib/notion/invoice'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)

    // @react-pdf/renderer는 동적으로 import (서버 사이드 전용)
    const { renderToStream } = await import('@react-pdf/renderer')
    const { InvoicePdfDocument } = await import(
      '@/components/invoice/InvoicePdfDocument'
    )
    const React = await import('react')

    const element = React.createElement(InvoicePdfDocument, { invoice })

    // @react-pdf/renderer의 타입과 React 엘리먼트 타입 호환을 위한 캐스팅
    const stream = await renderToStream(
      element as Parameters<typeof renderToStream>[0]
    )

    const fileName = `견적서_${invoice.projectName}_${invoice.issuedAt}.pdf`

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '견적서를 찾을 수 없습니다.', code: 404 },
      { status: 404 }
    )
  }
}
