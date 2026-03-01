import type { InvoiceItem } from '@/types/invoice'

interface InvoiceTableProps {
  items: InvoiceItem[]
}

/** 원화 형식으로 금액 포맷 */
function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/** 견적서 품목 테이블 */
export function InvoiceTable({ items }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-3 font-medium">No.</th>
            <th className="pb-3 font-medium">서비스명</th>
            <th className="pb-3 text-right font-medium">수량</th>
            <th className="pb-3 text-right font-medium">단가</th>
            <th className="pb-3 text-right font-medium">금액</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const amount = item.qty * item.unitPrice
            return (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 text-gray-500">{index + 1}</td>
                <td className="py-3 text-gray-900">{item.name}</td>
                <td className="py-3 text-right text-gray-700">{item.qty}</td>
                <td className="py-3 text-right text-gray-700">
                  {formatKRW(item.unitPrice)}
                </td>
                <td className="py-3 text-right text-gray-900">
                  {formatKRW(amount)}
                </td>
              </tr>
            )
          })}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                품목이 없습니다.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
