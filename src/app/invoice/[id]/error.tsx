'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** 견적서 서버 오류 페이지 */
export default function InvoiceError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('견적서 오류:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-4xl">⚠️</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          일시적인 오류가 발생했습니다
        </h1>
        <p className="mt-2 text-gray-500">잠시 후 다시 시도해 주세요.</p>
        <Button className="mt-6" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </div>
  )
}
