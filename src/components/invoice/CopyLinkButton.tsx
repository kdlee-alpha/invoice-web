'use client'

import { useState } from 'react'
import { Link } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/** 견적서 URL 복사 버튼 */
export function CopyLinkButton() {
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = async () => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(window.location.href)
      toast.success('링크가 복사되었습니다.')
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={isCopying}
      aria-label="견적서 링크 복사"
    >
      <Link className="mr-2 h-4 w-4" />
      링크 복사
    </Button>
  )
}
