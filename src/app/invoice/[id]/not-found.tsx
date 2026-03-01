/** 견적서 404 페이지 */
export default function InvoiceNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-4xl">🔍</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          견적서를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-gray-500">
          요청하신 견적서가 존재하지 않거나 이미 만료되었습니다.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          견적서 링크를 다시 확인해 주세요.
        </p>
      </div>
    </div>
  )
}
