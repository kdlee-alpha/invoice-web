// src/types/invoice.ts

/** 품목 1건 */
export interface InvoiceItem {
  /** 서비스/상품명 */
  name: string
  /** 수량 */
  qty: number
  /** 단가 (원) */
  unitPrice: number
}

/** 발신자 정보 */
export interface SenderInfo {
  /** 회사명 또는 개인 이름 */
  companyName: string
  /** 이메일 */
  email?: string
  /** 연락처 */
  phone?: string
  /** 로고 이미지 URL (노션 파일 URL) */
  logoUrl?: string
}

/** 수신자 정보 */
export interface ReceiverInfo {
  /** 클라이언트 회사명 */
  companyName: string
  /** 담당자명 */
  contactName?: string
}

/** 견적서 상태 */
export type InvoiceStatus = 'draft' | 'sent' | 'accepted'

/** 견적서 메인 데이터 */
export interface Invoice {
  /** 노션 페이지 ID */
  id: string
  /** 프로젝트명 (견적서 제목) */
  projectName: string
  /** 견적번호 (예: INV-2024-001) */
  invoiceNumber?: string
  /** 발행일 (ISO 8601) */
  issuedAt: string
  /** 유효기간 (ISO 8601) */
  validUntil?: string
  /** 발신자 정보 */
  sender: SenderInfo
  /** 수신자 정보 */
  receiver: ReceiverInfo
  /** 품목 목록 */
  items: InvoiceItem[]
  /** 세율 (%) — 기본값: 10 */
  taxRate: number
  /** 메모 / 참고사항 */
  memo?: string
  /** 견적서 상태 */
  status: InvoiceStatus
}

/** 금액 계산 결과 */
export interface InvoiceAmounts {
  /** 공급가액 합계 */
  subtotal: number
  /** 부가세 */
  tax: number
  /** 최종 합계 */
  total: number
}

/** API 응답 공통 형식 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number }

/** 견적서 조회 응답 */
export type InvoiceResponse = ApiResponse<Invoice>
