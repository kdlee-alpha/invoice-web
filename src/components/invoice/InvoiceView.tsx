import type { Invoice, InvoiceAmounts } from '@/types/invoice'
import { InvoiceHeader } from './InvoiceHeader'
import { InvoiceTable } from './InvoiceTable'
import { InvoiceSummary } from './InvoiceSummary'
import { InvoiceFooter } from './InvoiceFooter'
import { CopyLinkButton } from './CopyLinkButton'
import { PdfDownloadButton } from './PdfDownloadButton'

interface InvoiceViewProps {
  invoice: Invoice
}

/** 품목 금액 계산 */
function calculateAmounts(invoice: Invoice): InvoiceAmounts {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )
  const tax = Math.round(subtotal * (invoice.taxRate / 100))
  return { subtotal, tax, total: subtotal + tax }
}

/** 견적서 메인 렌더링 컴포넌트 */
export function InvoiceView({ invoice }: InvoiceViewProps) {
  const amounts = calculateAmounts(invoice)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 액션 바 */}
      <div className="border-b bg-white px-4 py-3 shadow-sm md:sticky md:top-0 md:z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {invoice.projectName}
          </span>
          <div className="flex gap-2">
            <CopyLinkButton />
            <PdfDownloadButton
              invoiceId={invoice.id}
              projectName={invoice.projectName}
            />
          </div>
        </div>
      </div>

      {/* A4 카드 영역 */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg md:p-12">
          <InvoiceHeader invoice={invoice} />
          <InvoiceTable items={invoice.items} />
          <InvoiceSummary amounts={amounts} taxRate={invoice.taxRate} />
          <InvoiceFooter memo={invoice.memo} validUntil={invoice.validUntil} />
        </div>
      </div>

      {/* 모바일 하단 액션 바 */}
      <div className="fixed right-0 bottom-0 left-0 border-t bg-white px-4 py-3 md:hidden">
        <div className="flex gap-2">
          <CopyLinkButton />
          <PdfDownloadButton
            invoiceId={invoice.id}
            projectName={invoice.projectName}
          />
        </div>
      </div>
    </div>
  )
}
