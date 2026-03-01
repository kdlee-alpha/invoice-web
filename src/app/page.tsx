/** 루트 페이지 — 견적서 뷰어로 직접 접속 안내 */
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">견적서 웹 뷰어</h1>
        <p className="mt-3 text-gray-500">견적서 링크를 통해 접속해 주세요.</p>
        <p className="mt-2 text-sm text-gray-400">
          예시: /invoice/[노션-페이지-ID]
        </p>
      </div>
    </main>
  )
}
