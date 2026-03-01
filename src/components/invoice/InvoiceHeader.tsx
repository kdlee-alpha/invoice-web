import Image from 'next/image'
import type { Invoice } from '@/types/invoice'

interface InvoiceHeaderProps {
  invoice: Invoice
}

/** 견적서 헤더 — 발신자/수신자 정보 */
export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const { sender, receiver, invoiceNumber, issuedAt, validUntil } = invoice

  return (
    <>
      {/* 발신자 & 견적서 정보 */}
      <div className="flex items-start justify-between">
        <div>
          {sender.logoUrl ? (
            <div className="mb-3">
              <Image
                src={sender.logoUrl}
                alt={`${sender.companyName} 로고`}
                width={120}
                height={48}
                className="object-contain"
              />
            </div>
          ) : null}
          <p className="text-lg font-semibold text-gray-900">
            {sender.companyName}
          </p>
          {sender.email ? (
            <p className="mt-1 text-sm text-gray-500">{sender.email}</p>
          ) : null}
          {sender.phone ? (
            <p className="text-sm text-gray-500">{sender.phone}</p>
          ) : null}
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">견적서</h1>
          {invoiceNumber ? (
            <p className="mt-1 text-sm text-gray-500">
              견적번호: {invoiceNumber}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-gray-500">발행일: {issuedAt}</p>
          {validUntil ? (
            <p className="text-sm text-gray-500">유효기간: {validUntil}</p>
          ) : null}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* 수신자 정보 */}
      <div>
        <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
          수신
        </p>
        <p className="mt-1 text-base font-semibold text-gray-900">
          {receiver.companyName}
        </p>
        {receiver.contactName ? (
          <p className="text-sm text-gray-600">{receiver.contactName} 귀중</p>
        ) : null}
      </div>

      <hr className="my-6 border-gray-200" />
    </>
  )
}
