# 견적서 웹 뷰어 (Invoice Web Viewer) MVP PRD

> 문서 버전: 1.0.0
> 작성일: 2026-02-27
> 작성자: 솔로 개발자 (Claude Code 보조)
> 상태: 작성 완료

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [사용자 정의](#2-사용자-정의)
3. [기능 요구사항](#3-기능-요구사항)
4. [데이터 모델](#4-데이터-모델)
5. [API 설계](#5-api-설계)
6. [UI/UX 요구사항](#6-uiux-요구사항)
7. [비기능 요구사항](#7-비기능-요구사항)
8. [개발 환경 설정](#8-개발-환경-설정)
9. [MVP 완료 기준](#9-mvp-완료-기준)
10. [향후 로드맵](#10-향후-로드맵)

---

## 1. 프로젝트 개요

### 배경

프리랜서, 1인 사업자, 소규모 에이전시는 클라이언트에게 견적서를 전달할 때 주로 PDF 파일을 이메일로 전송하거나 Word/Excel 파일을 공유한다. 이 방식은 파일 버전 관리가 어렵고, 수정 시 재전송이 필요하며, 모바일에서 가독성이 낮다.

많은 1인 개발자와 프리랜서가 이미 노션(Notion)을 업무 관리 도구로 활용하고 있다. 노션에 견적 정보를 입력하면, 클라이언트가 별도 앱 설치 없이 웹 브라우저로 견적서를 확인하고 PDF로 저장할 수 있는 가장 단순한 도구가 필요하다.

### 목적

노션 데이터베이스에 입력된 견적 정보를 클라이언트가 웹 브라우저로 확인하고 PDF로 다운로드할 수 있는 최소 기능 제품(MVP)을 개발한다.

**핵심 가치 제안:**
- 발신자: 노션에 데이터 입력 후 링크 하나만 공유하면 끝
- 수신자: 링크 클릭 한 번으로 견적서 확인 및 PDF 저장

### 성공 지표 (KPI)

| 지표 | MVP 목표 | 측정 방법 |
|------|----------|----------|
| 견적서 페이지 로딩 시간 | 노션 API 응답 후 2초 이내 | Vercel Analytics |
| PDF 다운로드 성공률 | 95% 이상 | 오류 로그 모니터링 |
| 한글 폰트 렌더링 | PDF에 한글 정상 출력 | 직접 확인 |
| 모바일 가독성 | 375px 이상 화면에서 정상 표시 | 브라우저 개발자 도구 |

---

## 2. 사용자 정의

### 페르소나 A — 발신자 (Sender)

**대표 유형:** 프리랜서 웹 개발자, 1인 디자인 스튜디오, 소규모 마케팅 에이전시

**특성:**
- 노션을 이미 업무 도구로 사용 중
- 월 3~10건의 견적서를 발행
- 직접 코딩보다는 노션 입력 후 링크 공유를 선호
- 클라이언트에게 전문적인 인상을 주고 싶어 함

**주요 목표:**
1. 노션에 견적 정보를 입력하고 링크를 생성한다.
2. 클라이언트에게 링크를 전달한다.
3. 별도의 PDF 파일 첨부 없이도 전문적인 견적서를 제공한다.

**사용 시나리오:**
1. 노션 데이터베이스에 새 견적서 행을 추가한다.
2. 프로젝트명, 품목, 단가 등 필드를 채운다.
3. 해당 행의 노션 페이지 ID를 복사한다.
4. `https://your-domain.com/invoice/[notion-page-id]` 형태의 링크를 클라이언트에게 전달한다.

---

### 페르소나 B — 수신자 (Client)

**대표 유형:** 스타트업 대표, 중소기업 마케팅 팀장, 개인 사업자

**특성:**
- 기술 친화도가 낮거나 보통 수준
- 모바일로 먼저 확인하는 경우가 많음
- PDF로 저장하여 내부 결재 또는 보관 목적으로 사용
- 별도 계정 생성이나 앱 설치를 원하지 않음

**주요 목표:**
1. 링크를 클릭하여 견적 내용을 즉시 확인한다.
2. 필요시 PDF로 저장하여 내부 결재에 활용한다.
3. 로그인 없이 바로 접근한다.

**사용 시나리오:**
1. 수신한 링크를 클릭한다.
2. 브라우저에서 견적서 내용(품목, 금액, 조건 등)을 확인한다.
3. "PDF 저장" 버튼을 눌러 로컬에 저장한다.

---

## 3. 기능 요구사항

우선순위 기준:
- **P0**: MVP에 반드시 포함. 없으면 제품이 동작하지 않음.
- **P1**: MVP에 포함 권장. 사용성에 직접적 영향.
- **P2**: MVP 이후. v2에서 구현.

---

### P0 — 핵심 기능 (반드시 구현)

#### F001. 노션 API 데이터 조회

| 항목 | 내용 |
|------|------|
| 기능명 | 노션 페이지 데이터 조회 |
| 설명 | 노션 페이지 ID를 기반으로 `@notionhq/client` SDK를 통해 견적 데이터를 서버 사이드에서 가져온다. |
| 입력 | URL 파라미터의 노션 페이지 ID (`[id]`) |
| 출력 | 구조화된 `Invoice` 객체 |
| 오류 처리 | 페이지 없음(404), API 오류(500), 접근 권한 없음(403) 각각 처리 |
| 캐싱 | Next.js `unstable_cache` 또는 `revalidate: 60`으로 60초 캐싱 |

#### F002. 견적서 웹 뷰 렌더링

| 항목 | 내용 |
|------|------|
| 기능명 | 견적서 웹 페이지 렌더링 |
| 설명 | 노션에서 가져온 데이터를 A4 비율의 견적서 레이아웃으로 브라우저에 렌더링한다. |
| URL | `/invoice/[id]` |
| 레이아웃 | A4 비율 (210mm × 297mm 기준), 반응형 |
| 표시 요소 | 발신자 로고, 회사 정보, 수신자 정보, 품목 테이블, 소계/세금/합계, 메모, 견적 유효기간 |
| 오류 상태 | 데이터 없음 / API 오류 각각 안내 페이지 표시 |

#### F003. PDF 다운로드

| 항목 | 내용 |
|------|------|
| 기능명 | 견적서 PDF 저장 |
| 설명 | "PDF 저장" 버튼 클릭 시 현재 견적서를 PDF 파일로 즉시 다운로드한다. |
| 구현 방식 | `@react-pdf/renderer` (서버 사이드 PDF 생성 권장) 또는 `html2canvas + jsPDF` (클라이언트 사이드) |
| 파일명 형식 | `견적서_[프로젝트명]_[발행일].pdf` (예: `견적서_랜딩페이지제작_2026-02-27.pdf`) |
| 페이지 크기 | A4 (210 × 297mm) |
| 한글 폰트 | Noto Sans KR 임베딩 필수 |
| 접근성 | 버튼에 `aria-label="견적서 PDF 저장"` 필수 |

---

### P1 — 사용성 기능 (MVP에 포함 권장)

#### F004. URL 복사 버튼

| 항목 | 내용 |
|------|------|
| 기능명 | 견적서 링크 복사 |
| 설명 | 현재 견적서의 URL을 클립보드에 복사하는 버튼을 제공한다. |
| 동작 | 버튼 클릭 → `navigator.clipboard.writeText()` 실행 → "복사됨" 토스트 알림 표시 |
| 표시 위치 | 견적서 상단 액션 영역 |
| 접근성 | `aria-label="견적서 링크 복사"` 필수 |

#### F005. 오류 페이지

| 항목 | 내용 |
|------|------|
| 기능명 | 견적서 조회 오류 안내 |
| 설명 | 노션 페이지 ID가 잘못되었거나 접근 불가 시 사용자 친화적인 오류 페이지를 표시한다. |
| 오류 유형 | 페이지를 찾을 수 없음 / 접근 권한 없음 / 서버 오류 |
| 구현 | Next.js `error.tsx`, `not-found.tsx` 활용 |

---

### P2 — MVP 이후 기능 (제외)

- 견적서 목록 및 대시보드
- 발신자 로그인/인증
- 클라이언트의 승인/반려 워크플로우
- 이메일 자동 발송
- 견적서 직접 편집 UI
- 결제 연동
- 열람 통계 (몇 번 조회했는지)

---

## 4. 데이터 모델

### 4.1 노션 데이터베이스 스키마

노션 데이터베이스에서 사용하는 필드 목록이다. 노션 API를 통해 읽어올 때 이 필드명을 기준으로 파싱한다.

| 필드명 | 노션 타입 | 설명 | 필수 여부 |
|--------|-----------|------|-----------|
| `프로젝트명` | Title | 견적서 제목 | 필수 |
| `견적번호` | Text | 예: INV-2024-001 | 선택 |
| `발행일` | Date | 견적서 발행 날짜 | 필수 |
| `유효기간` | Date | 견적 유효 만료일 | 선택 |
| `발신자_회사명` | Text | 발신 회사/개인 이름 | 필수 |
| `발신자_이메일` | Email | 연락처 이메일 | 선택 |
| `발신자_연락처` | Phone | 연락처 전화번호 | 선택 |
| `수신자_회사명` | Text | 클라이언트 회사명 | 필수 |
| `수신자_담당자` | Text | 클라이언트 담당자명 | 선택 |
| `품목_목록` | Rich Text | JSON 형태: `[{name, qty, unit_price}]` | 필수 |
| `세율` | Number | 부가세율 (예: 10) | 선택 (기본값: 10) |
| `메모` | Rich Text | 하단 참고사항 | 선택 |
| `로고_이미지` | Files & Media | 발신자 로고 파일 | 선택 |
| `상태` | Select | `draft` / `sent` / `accepted` | 선택 |

### 4.2 TypeScript 인터페이스

```typescript
// src/types/invoice.ts

/** 품목 1건 */
export interface InvoiceItem {
  /** 서비스/상품명 */
  name: string;
  /** 수량 */
  qty: number;
  /** 단가 (원) */
  unitPrice: number;
}

/** 발신자 정보 */
export interface SenderInfo {
  /** 회사명 또는 개인 이름 */
  companyName: string;
  /** 이메일 */
  email?: string;
  /** 연락처 */
  phone?: string;
  /** 로고 이미지 URL (노션 파일 URL) */
  logoUrl?: string;
}

/** 수신자 정보 */
export interface ReceiverInfo {
  /** 클라이언트 회사명 */
  companyName: string;
  /** 담당자명 */
  contactName?: string;
}

/** 견적서 상태 */
export type InvoiceStatus = 'draft' | 'sent' | 'accepted';

/** 견적서 메인 데이터 */
export interface Invoice {
  /** 노션 페이지 ID */
  id: string;
  /** 프로젝트명 (견적서 제목) */
  projectName: string;
  /** 견적번호 (예: INV-2024-001) */
  invoiceNumber?: string;
  /** 발행일 (ISO 8601) */
  issuedAt: string;
  /** 유효기간 (ISO 8601) */
  validUntil?: string;
  /** 발신자 정보 */
  sender: SenderInfo;
  /** 수신자 정보 */
  receiver: ReceiverInfo;
  /** 품목 목록 */
  items: InvoiceItem[];
  /** 세율 (%) — 기본값: 10 */
  taxRate: number;
  /** 메모 / 참고사항 */
  memo?: string;
  /** 견적서 상태 */
  status: InvoiceStatus;
}

/** 금액 계산 결과 */
export interface InvoiceAmounts {
  /** 공급가액 합계 */
  subtotal: number;
  /** 부가세 */
  tax: number;
  /** 최종 합계 */
  total: number;
}

/** API 응답 공통 형식 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

/** 견적서 조회 응답 */
export type InvoiceResponse = ApiResponse<Invoice>;
```

### 4.3 노션 API 응답 파싱 규칙

노션 API는 필드 타입마다 다른 구조로 데이터를 반환한다. 아래 규칙으로 파싱한다.

```typescript
// 노션 API 응답 파싱 예시 (src/lib/notion/parser.ts)

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Invoice, InvoiceItem } from '@/types/invoice';

/** 노션 페이지 응답을 Invoice 객체로 변환 */
export function parseNotionPageToInvoice(
  page: PageObjectResponse
): Invoice {
  const props = page.properties;

  // Title 타입 파싱
  const projectName =
    props['프로젝트명']?.type === 'title'
      ? props['프로젝트명'].title.map((t) => t.plain_text).join('')
      : '제목 없음';

  // Rich Text 타입 파싱 — 품목 목록 JSON 파싱
  const itemsRaw =
    props['품목_목록']?.type === 'rich_text'
      ? props['품목_목록'].rich_text.map((t) => t.plain_text).join('')
      : '[]';

  let items: InvoiceItem[] = [];
  try {
    items = JSON.parse(itemsRaw) as InvoiceItem[];
  } catch {
    items = [];
  }

  // Date 타입 파싱
  const issuedAt =
    props['발행일']?.type === 'date'
      ? (props['발행일'].date?.start ?? new Date().toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0];

  // Files & Media 타입 — 로고 URL 파싱
  const logoUrl =
    props['로고_이미지']?.type === 'files' &&
    props['로고_이미지'].files.length > 0
      ? props['로고_이미지'].files[0].type === 'file'
        ? props['로고_이미지'].files[0].file.url
        : props['로고_이미지'].files[0].type === 'external'
          ? props['로고_이미지'].files[0].external.url
          : undefined
      : undefined;

  return {
    id: page.id,
    projectName,
    invoiceNumber:
      props['견적번호']?.type === 'rich_text'
        ? props['견적번호'].rich_text.map((t) => t.plain_text).join('')
        : undefined,
    issuedAt,
    validUntil:
      props['유효기간']?.type === 'date'
        ? (props['유효기간'].date?.start ?? undefined)
        : undefined,
    sender: {
      companyName:
        props['발신자_회사명']?.type === 'rich_text'
          ? props['발신자_회사명'].rich_text.map((t) => t.plain_text).join('')
          : '',
      email:
        props['발신자_이메일']?.type === 'email'
          ? (props['발신자_이메일'].email ?? undefined)
          : undefined,
      phone:
        props['발신자_연락처']?.type === 'phone_number'
          ? (props['발신자_연락처'].phone_number ?? undefined)
          : undefined,
      logoUrl,
    },
    receiver: {
      companyName:
        props['수신자_회사명']?.type === 'rich_text'
          ? props['수신자_회사명'].rich_text.map((t) => t.plain_text).join('')
          : '',
      contactName:
        props['수신자_담당자']?.type === 'rich_text'
          ? props['수신자_담당자'].rich_text.map((t) => t.plain_text).join('')
          : undefined,
    },
    items,
    taxRate:
      props['세율']?.type === 'number' ? (props['세율'].number ?? 10) : 10,
    memo:
      props['메모']?.type === 'rich_text'
        ? props['메모'].rich_text.map((t) => t.plain_text).join('')
        : undefined,
    status:
      props['상태']?.type === 'select'
        ? ((props['상태'].select?.name ?? 'draft') as Invoice['status'])
        : 'draft',
  };
}
```

---

## 5. API 설계

### 5.1 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx                        # 루트 — 랜딩 또는 리다이렉트 (최소화)
│   ├── invoice/
│   │   └── [id]/
│   │       ├── page.tsx                # 견적서 웹 뷰 페이지 (Server Component)
│   │       ├── loading.tsx             # 로딩 스켈레톤
│   │       ├── error.tsx               # 오류 UI
│   │       └── not-found.tsx           # 페이지 없음 UI
│   └── api/
│       └── invoice/
│           └── [id]/
│               └── pdf/
│                   └── route.ts        # PDF 스트림 응답 엔드포인트 (선택)
├── lib/
│   └── notion/
│       ├── client.ts                   # Notion 클라이언트 싱글톤
│       ├── parser.ts                   # 노션 응답 파싱 유틸
│       └── invoice.ts                  # 견적서 데이터 조회 함수
├── components/
│   └── invoice/
│       ├── InvoiceView.tsx             # 견적서 렌더링 컴포넌트
│       ├── InvoiceHeader.tsx           # 발신자/수신자 헤더
│       ├── InvoiceTable.tsx            # 품목 테이블
│       ├── InvoiceSummary.tsx          # 소계/세금/합계
│       ├── InvoiceFooter.tsx           # 메모, 유효기간
│       ├── PdfDownloadButton.tsx       # PDF 다운로드 버튼
│       └── CopyLinkButton.tsx          # URL 복사 버튼
└── types/
    └── invoice.ts                      # TypeScript 인터페이스
```

### 5.2 데이터 조회 함수

```typescript
// src/lib/notion/invoice.ts

import { unstable_cache } from 'next/cache';
import { notionClient } from './client';
import { parseNotionPageToInvoice } from './parser';
import type { Invoice } from '@/types/invoice';

/** 노션 페이지 ID로 견적서 데이터 조회 (60초 캐싱) */
export const getInvoiceById = unstable_cache(
  async (pageId: string): Promise<Invoice> => {
    const page = await notionClient.pages.retrieve({ page_id: pageId });

    if (page.object !== 'page') {
      throw new Error('유효하지 않은 노션 페이지입니다.');
    }

    return parseNotionPageToInvoice(page as PageObjectResponse);
  },
  ['invoice'],
  { revalidate: 60 }
);
```

### 5.3 견적서 페이지 (Server Component)

```typescript
// src/app/invoice/[id]/page.tsx

import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/lib/notion/invoice';
import { InvoiceView } from '@/components/invoice/InvoiceView';

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  try {
    const invoice = await getInvoiceById(id);
    return <InvoiceView invoice={invoice} />;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Could not find')) {
      notFound();
    }
    throw error; // error.tsx에서 처리
  }
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const { id } = await params;
  try {
    const invoice = await getInvoiceById(id);
    return {
      title: `견적서 — ${invoice.projectName}`,
      description: `${invoice.sender.companyName}에서 발행한 견적서입니다.`,
    };
  } catch {
    return { title: '견적서' };
  }
}
```

### 5.4 PDF Route Handler (선택 구현)

`@react-pdf/renderer`를 서버 사이드에서 사용하는 경우, PDF를 스트림으로 내려보내는 Route Handler를 제공한다.

```typescript
// src/app/api/invoice/[id]/pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { getInvoiceById } from '@/lib/notion/invoice';
import { InvoicePdfDocument } from '@/components/invoice/InvoicePdfDocument';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const invoice = await getInvoiceById(id);
    const stream = await renderToStream(<InvoicePdfDocument invoice={invoice} />);

    const fileName = `견적서_${invoice.projectName}_${invoice.issuedAt}.pdf`;

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '견적서를 찾을 수 없습니다.', code: 404 },
      { status: 404 }
    );
  }
}
```

### 5.5 노션 클라이언트 싱글톤

```typescript
// src/lib/notion/client.ts

import { Client } from '@notionhq/client';

if (!process.env.NOTION_API_KEY) {
  throw new Error('환경변수 NOTION_API_KEY가 설정되지 않았습니다.');
}

/** 노션 API 클라이언트 싱글톤 — 서버 사이드 전용 */
export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});
```

---

## 6. UI/UX 요구사항

### 6.1 전체 사용자 플로우

```
[클라이언트가 링크 수신]
         |
         v
[/invoice/[id] 접속]
         |
    [데이터 로딩 중]
    loading.tsx 표시
         |
    -----+-----
    |         |
  성공       실패
    |         |
    v         v
[견적서    [오류 페이지]
 웹 뷰]   error.tsx /
    |      not-found.tsx
    |
  -----+--------
  |            |
[PDF 저장]  [링크 복사]
버튼 클릭   버튼 클릭
  |            |
[PDF 다운]  [클립보드
  완료]      복사 완료]
             [토스트 표시]
```

### 6.2 루트 페이지 (`/`)

**역할:** 최소화. MVP에서는 견적서 뷰로 직접 이동하도록 안내하거나 404 처리.

**레이아웃:**
```
┌──────────────────────────────────────┐
│                                      │
│   견적서 웹 뷰어                        │
│                                      │
│   견적서 링크를 통해 접속해 주세요.         │
│                                      │
│   예시: /invoice/[노션-페이지-ID]         │
│                                      │
└──────────────────────────────────────┘
```

---

### 6.3 견적서 뷰 페이지 (`/invoice/[id]`)

**역할:** 이 서비스의 핵심 페이지. 노션 데이터를 A4 비율 견적서로 렌더링한다.

**레이아웃 (데스크탑 — A4 비율 중앙 정렬):**

```
┌─────────────────── 액션 바 (sticky) ──────────────────────┐
│  [🔗 링크 복사]                    [⬇ PDF 저장]          │
└───────────────────────────────────────────────────────────┘

┌─────────────────── A4 카드 영역 ──────────────────────────┐
│                                                           │
│  [로고 이미지]              견적서                         │
│                             견적번호: INV-2024-001        │
│  발신자 회사명                                             │
│  이메일 | 연락처              발행일: 2026-02-27           │
│                             유효기간: 2026-03-13          │
│───────────────────────────────────────────────────────────│
│  수신:                                                    │
│  [수신자 회사명]                                           │
│  [담당자명] 귀중                                           │
│───────────────────────────────────────────────────────────│
│  No. | 서비스명           | 수량 | 단가      | 금액       │
│   1  | 랜딩페이지 디자인   |  1  | 2,000,000 | 2,000,000 │
│   2  | 개발 구현          |  1  | 3,000,000 | 3,000,000 │
│───────────────────────────────────────────────────────────│
│                              공급가액: 5,000,000원        │
│                              부가세(10%):  500,000원      │
│                              합  계:   5,500,000원        │
│───────────────────────────────────────────────────────────│
│  [메모 / 참고사항]                                         │
│  - 계약 후 50% 선금 필요                                   │
│  - 유효기간 내 계약 체결 시 적용                             │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**반응형 규칙:**
- 768px 이상: A4 카드가 중앙 정렬, 최대 너비 794px
- 768px 미만: 전체 너비, 패딩 16px, 폰트 크기 소폭 축소
- 액션 바: 모바일에서 하단 고정 (sticky bottom)

**색상 시스템:**
- 배경: `gray-50`
- 카드: `white`, 그림자 `shadow-lg`
- 헤더 구분선: `gray-200`
- 합계 행: `gray-900` (볼드)
- 강조 금액: 한국 원화 형식 (`Intl.NumberFormat`)

---

### 6.4 로딩 상태 (`loading.tsx`)

```typescript
// src/app/invoice/[id]/loading.tsx
// 스켈레톤 UI — A4 카드 비율의 Skeleton 컴포넌트 표시
```

**표시 요소:**
- 상단 로고 영역 스켈레톤
- 발신자/수신자 텍스트 라인 스켈레톤
- 품목 테이블 행 스켈레톤 (3행)
- 합계 영역 스켈레톤

---

### 6.5 오류 페이지

**404 — 견적서를 찾을 수 없음 (`not-found.tsx`):**

```
┌──────────────────────────────────────┐
│                                      │
│   🔍 견적서를 찾을 수 없습니다          │
│                                      │
│   요청하신 견적서가 존재하지 않거나       │
│   이미 만료되었습니다.                  │
│                                      │
│   견적서 링크를 다시 확인해 주세요.      │
│                                      │
└──────────────────────────────────────┘
```

**500 — 서버 오류 (`error.tsx`):**

```
┌──────────────────────────────────────┐
│                                      │
│   ⚠️ 일시적인 오류가 발생했습니다        │
│                                      │
│   잠시 후 다시 시도해 주세요.           │
│                                      │
│   [다시 시도]                         │
│                                      │
└──────────────────────────────────────┘
```

---

## 7. 비기능 요구사항

### 7.1 성능

| 항목 | 목표 | 구현 방법 |
|------|------|----------|
| 초기 렌더링 | 노션 API 응답 후 2초 이내 | Server Component + 스켈레톤 UI |
| 노션 API 캐싱 | 60초 캐싱 | `unstable_cache` / `revalidate: 60` |
| 이미지 최적화 | 로고 이미지 자동 최적화 | Next.js `<Image>` 컴포넌트 |
| PDF 생성 | 클릭 후 3초 이내 시작 | 서버 사이드 스트림 또는 클라이언트 사이드 비동기 |

### 7.2 보안

| 항목 | 규칙 |
|------|------|
| API 키 노출 | `NOTION_API_KEY`는 서버 사이드 전용. `NEXT_PUBLIC_` 접두사 절대 사용 금지. |
| 환경변수 검증 | 서버 시작 시 필수 환경변수 존재 여부 확인 |
| 노션 파일 URL | 노션 임시 URL은 1시간 후 만료. 로고 이미지는 `next.config.ts`에 `notionhq.com` 도메인 허용 추가 |
| 입력 검증 | URL 파라미터 `[id]`는 노션 UUID 형식 검증 후 API 호출 |

### 7.3 접근성

| 항목 | 구현 |
|------|------|
| PDF 버튼 | `aria-label="견적서 PDF 저장"` 필수 |
| 링크 복사 버튼 | `aria-label="견적서 링크 복사"` 필수 |
| 이미지 alt | 로고 이미지 `alt={`${sender.companyName} 로고`}` |
| 색상 대비 | WCAG AA 기준 4.5:1 이상 |
| 포커스 표시 | 키보드 탐색 시 포커스 링 표시 |

### 7.4 한글 지원

| 항목 | 구현 |
|------|------|
| 웹 폰트 | Noto Sans KR (Google Fonts 또는 `next/font`) |
| PDF 폰트 | Noto Sans KR `.ttf` 파일 임베딩 (`@react-pdf/renderer`의 `Font.register`) |
| 파일명 인코딩 | PDF 다운로드 시 `Content-Disposition: filename*=UTF-8''${encodeURIComponent(fileName)}` |
| 금액 형식 | `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })` |

---

## 8. 개발 환경 설정

### 8.1 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성한다.

```env
# 노션 통합 시크릿 키
# 노션 설정 > 연결 > 새 통합 만들기 에서 발급
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 대상 노션 데이터베이스 ID
# 데이터베이스 URL: https://notion.so/[workspace]/[DATABASE_ID]?v=...
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 배포 도메인 URL (로컬 개발 시: http://localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 8.2 노션 통합 초기 설정 방법

#### Step 1. 노션 통합(Integration) 생성

1. [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. "새 통합" 클릭
3. 이름: `Invoice Web Viewer` (임의 설정)
4. 권한: **콘텐츠 읽기** 만 체크 (쓰기 불필요)
5. 생성 후 **시크릿 키** 복사 → `NOTION_API_KEY`에 입력

#### Step 2. 데이터베이스 연결

1. 노션에서 견적서 데이터베이스 페이지 열기
2. 우측 상단 `...` 메뉴 → **연결** → Step 1에서 만든 통합 선택
3. 데이터베이스 URL에서 ID 추출: `https://notion.so/workspace/[여기가 DATABASE_ID]?v=...`
4. 추출한 ID → `NOTION_DATABASE_ID`에 입력

#### Step 3. 데이터베이스 스키마 생성

노션 데이터베이스에 [4.1 노션 데이터베이스 스키마](#41-노션-데이터베이스-스키마) 표를 참고하여 필드를 추가한다.

#### Step 4. 의존성 설치

```bash
# 노션 공식 SDK
npm install @notionhq/client

# PDF 생성 (선택 1: 서버 사이드 권장)
npm install @react-pdf/renderer
npm install --save-dev @types/react-pdf

# PDF 생성 (선택 2: 클라이언트 사이드)
npm install html2canvas jspdf
```

#### Step 5. Next.js 이미지 도메인 설정

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 노션 파일 업로드 서버 (로고 이미지)
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        // 노션 외부 이미지
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
```

### 8.3 개발 서버 실행

```bash
npm run dev      # Turbopack 개발 서버 시작 (http://localhost:3000)
```

테스트 URL: `http://localhost:3000/invoice/[노션-페이지-ID]`

노션 페이지 ID 확인 방법: 노션 페이지에서 `Share` → `Copy link` 후 URL의 마지막 32자리 문자열.

---

## 9. MVP 완료 기준

아래 체크리스트를 모두 통과해야 MVP 배포 완료로 판단한다.

### 기능 완료 체크리스트

- [ ] `F001`: 노션 페이지 ID로 견적 데이터 정상 조회
- [ ] `F001`: 유효하지 않은 ID 입력 시 404 페이지 표시
- [ ] `F001`: 노션 API 오류 시 500 오류 페이지 표시
- [ ] `F001`: 데이터가 60초 캐싱되어 동일 ID 재요청 시 캐시 응답
- [ ] `F002`: 견적서 웹 페이지가 A4 비율로 정상 렌더링
- [ ] `F002`: 발신자 로고 이미지 정상 표시
- [ ] `F002`: 품목 목록, 소계, 세금, 합계 정상 계산 및 표시
- [ ] `F002`: 한국 원화 형식으로 금액 표시 (예: ₩5,500,000)
- [ ] `F002`: 모바일 (375px) 화면에서 가독성 확보
- [ ] `F003`: "PDF 저장" 버튼 클릭 시 PDF 다운로드 시작
- [ ] `F003`: PDF에 한글 정상 출력 (Noto Sans KR 적용)
- [ ] `F003`: 파일명이 `견적서_[프로젝트명]_[발행일].pdf` 형식
- [ ] `F003`: A4 사이즈로 PDF 생성
- [ ] `F004`: "링크 복사" 버튼 클릭 시 URL 클립보드 복사
- [ ] `F004`: 복사 완료 후 토스트 알림 표시

### 기술 완료 체크리스트

- [ ] `NOTION_API_KEY`가 클라이언트 번들에 포함되지 않음 (빌드 결과 확인)
- [ ] `npm run check-all` 모든 검사 통과
- [ ] `npm run build` 빌드 성공 (오류 없음)
- [ ] Vercel 배포 성공 및 배포 URL에서 정상 작동

---

## 10. 향후 로드맵

### v2 — 발신자 관리 기능

- 발신자 로그인/인증 (NextAuth.js + Supabase)
- 내 견적서 목록 대시보드
- 견적서 상태 관리 (발송 완료 → 검토 중 → 승인됨)
- 클라이언트의 온라인 승인/반려 버튼

### v3 — 자동화 및 고도화

- 이메일 발송 자동화 (Resend 연동)
- 견적 템플릿 저장 및 재사용
- 견적서 열람 통계 (조회 횟수, 최근 열람 시간)
- 클라이언트 관리 (수신자 주소록)
- 다국어 지원 (영문 견적서)

### v4 — 수익화

- 무료/유료 플랜 구분
- 월 구독 결제 연동 (Stripe)
- 커스텀 도메인 연결
- 화이트라벨 지원 (로고/브랜딩 완전 커스터마이징)

---

> 이 PRD는 솔로 개발자 기준으로 즉시 개발 착수 가능한 수준으로 작성되었습니다.
> 노션 스키마 필드명은 실제 노션 데이터베이스의 필드명과 정확히 일치해야 합니다.
