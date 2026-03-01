import type { InvoiceAmounts } from '@/types/invoice'

interface InvoiceSummaryProps {
  amounts: InvoiceAmounts
  taxRate: number
}

/** 원화 형식으로 금액 포맷 */
function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/** 견적서 금액 합계 영역 */
export function InvoiceSummary({ amounts, taxRate }: InvoiceSummaryProps) {
  return (
    <div className="mt-6 flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>공급가액</span>
          <span>{formatKRW(amounts.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>부가세({taxRate}%)</span>
          <span>{formatKRW(amounts.tax)}</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>합 계</span>
          <span>{formatKRW(amounts.total)}</span>
        </div>
      </div>
    </div>
  )
}
