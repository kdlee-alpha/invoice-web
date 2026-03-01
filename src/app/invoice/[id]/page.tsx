import { notFound } from 'next/navigation'
import { getInvoiceById } from '@/lib/notion/invoice'
import { InvoiceView } from '@/components/invoice/InvoiceView'

interface InvoicePageProps {
  params: Promise<{ id: string }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)
    return <InvoiceView invoice={invoice} />
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Could not find') ||
        error.message.includes('not_found'))
    ) {
      notFound()
    }
    throw error // error.tsx에서 처리
  }
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { id } = await params
  try {
    const invoice = await getInvoiceById(id)
    return {
      title: `견적서 — ${invoice.projectName}`,
      description: `${invoice.sender.companyName}에서 발행한 견적서입니다.`,
    }
  } catch {
    return { title: '견적서' }
  }
}
