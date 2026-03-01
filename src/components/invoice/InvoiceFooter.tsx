interface InvoiceFooterProps {
  memo?: string
  validUntil?: string
}

/** 견적서 하단 — 메모, 유효기간 안내 */
export function InvoiceFooter({ memo, validUntil }: InvoiceFooterProps) {
  if (!memo && !validUntil) return null

  return (
    <>
      <hr className="my-6 border-gray-200" />
      <div className="space-y-3">
        {memo ? (
          <div>
            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              참고사항
            </p>
            <p className="mt-1 text-sm whitespace-pre-line text-gray-600">
              {memo}
            </p>
          </div>
        ) : null}
        {validUntil ? (
          <p className="text-xs text-gray-400">
            본 견적서는 {validUntil}까지 유효합니다.
          </p>
        ) : null}
      </div>
    </>
  )
}
