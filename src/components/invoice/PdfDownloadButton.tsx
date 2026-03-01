'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PdfDownloadButtonProps {
  invoiceId: string
  projectName: string
}

/** PDF 다운로드 버튼 — API Route Handler를 통해 서버 사이드 PDF 다운로드 */
export function PdfDownloadButton({
  invoiceId,
  projectName,
}: PdfDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch(`/api/invoice/${invoiceId}/pdf`)

      if (!response.ok) {
        throw new Error('PDF 생성에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `견적서_${projectName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('PDF 다운로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label="견적서 PDF 저장"
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'PDF 생성 중...' : 'PDF 저장'}
    </Button>
  )
}
