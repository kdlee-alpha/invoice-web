import { Skeleton } from '@/components/ui/skeleton'

/** 견적서 로딩 스켈레톤 UI */
export default function InvoiceLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 액션 바 스켈레톤 */}
      <div className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl justify-between">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* A4 카드 스켈레톤 */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* 헤더 영역 */}
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-7 w-20" />
              <Skeleton className="ml-auto h-4 w-36" />
              <Skeleton className="ml-auto h-4 w-36" />
            </div>
          </div>

          <Skeleton className="my-6 h-px w-full" />

          {/* 수신자 영역 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="my-6 h-px w-full" />

          {/* 품목 테이블 스켈레톤 */}
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-8" />
                ))}
              </div>
            ))}
          </div>

          <Skeleton className="my-6 h-px w-full" />

          {/* 합계 영역 */}
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
