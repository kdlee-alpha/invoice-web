# 견적서 웹 뷰어 (Invoice Web Viewer) 개발 로드맵

노션 데이터베이스에 입력된 견적 정보를 웹 브라우저로 확인하고 PDF로 다운로드할 수 있는 MVP 서비스

## 개요

견적서 웹 뷰어는 프리랜서, 1인 사업자, 소규모 에이전시를 위한 견적서 공유 도구로 다음 기능을 제공합니다:

- **노션 API 데이터 조회**: 노션 데이터베이스에서 견적 정보를 실시간으로 가져와 구조화된 데이터로 변환
- **견적서 웹 뷰 렌더링**: A4 비율의 전문적인 견적서 레이아웃을 반응형으로 브라우저에 표시
- **PDF 다운로드**: 한글 폰트가 포함된 A4 사이즈 PDF 파일 생성 및 다운로드
- **URL 복사**: 견적서 링크를 클립보드에 복사하여 간편하게 공유
- **오류 처리**: 404/500 등 사용자 친화적인 오류 페이지 제공

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 완료로 표시

## 개발 단계

### Phase 1: 환경 설정 및 기반 구조

- **Task 001: 프로젝트 환경 설정 및 의존성 설치** - 우선순위 [P0]
  - `@notionhq/client` SDK 및 `@react-pdf/renderer` 의존성 설치
  - `.env.local` 환경변수 파일 생성 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL`)
  - `next.config.ts`에 노션 이미지 도메인 (`prod-files-secure.s3.us-west-2.amazonaws.com`) 허용 추가
  - `next/font`를 활용한 Noto Sans KR 한글 웹 폰트 설정 (`src/app/layout.tsx` 수정)
  - 기존 스타터 템플릿의 불필요한 페이지 정리 (`login`, `signup` 등 제거)

- **Task 002: TypeScript 타입 정의 및 인터페이스 설계** [P0]
  - `src/types/invoice.ts` 파일 생성 (Invoice, InvoiceItem, SenderInfo, ReceiverInfo, InvoiceAmounts 등)
  - `InvoiceStatus` 타입 정의 (`draft` | `sent` | `accepted`)
  - `ApiResponse<T>` 제네릭 응답 타입 및 `InvoiceResponse` 타입 정의
  - 금액 계산 유틸리티 함수 타입 정의 (`calculateInvoiceAmounts`)

- **Task 003: 라우트 구조 및 페이지 골격 생성** [P0]
  - `src/app/invoice/[id]/page.tsx` 견적서 뷰 페이지 골격 생성 (Server Component)
  - `src/app/invoice/[id]/loading.tsx` 로딩 스켈레톤 골격 생성
  - `src/app/invoice/[id]/error.tsx` 오류 UI 골격 생성 (Client Component)
  - `src/app/invoice/[id]/not-found.tsx` 404 페이지 골격 생성
  - `src/app/api/invoice/[id]/pdf/route.ts` PDF API 라우트 골격 생성
  - `src/app/page.tsx` 루트 페이지를 안내 페이지로 변경

### Phase 2: 노션 API 연동 레이어

- **Task 004: 노션 클라이언트 및 데이터 조회 구현** - 우선순위 [P0/F001]
  - `src/lib/notion/client.ts` 노션 API 클라이언트 싱글톤 생성 (환경변수 검증 포함)
  - `src/lib/notion/parser.ts` 노션 페이지 응답을 Invoice 객체로 변환하는 파서 구현
  - `src/lib/notion/invoice.ts` 견적서 데이터 조회 함수 구현 (`unstable_cache`, 60초 캐싱)
  - 노션 UUID 형식 입력 검증 유틸리티 구현
  - Playwright MCP를 활용한 노션 API 연동 통합 테스트

- **Task 005: 에러 처리 및 데이터 검증 레이어** [P0/F001]
  - 노션 API 오류 코드별 에러 핸들링 (404, 403, 500 분기 처리)
  - `APIResponseError` 타입 가드 및 커스텀 에러 클래스 구현
  - 품목 목록 JSON 파싱 실패 시 안전한 폴백 처리
  - 필수 필드 누락 시 기본값 적용 로직 (세율 기본값 10% 등)
  - Playwright MCP로 잘못된 페이지 ID 입력 시 에러 페이지 표시 검증

- **Task 006: 금액 계산 유틸리티 및 포맷팅** [P0/F002]
  - `src/lib/utils/invoice.ts` 금액 계산 함수 구현 (`subtotal`, `tax`, `total`)
  - `Intl.NumberFormat('ko-KR')` 기반 한국 원화 포맷팅 유틸리티 구현
  - 날짜 포맷팅 유틸리티 구현 (발행일, 유효기간 표시용)
  - 엣지 케이스 처리 (빈 품목 목록, 수량/단가 0 등)

### Phase 3: UI 컴포넌트 구현

- **Task 007: 견적서 핵심 컴포넌트 구현** - 우선순위 [P0/F002]
  - `src/components/invoice/InvoiceHeader.tsx` 발신자 로고, 회사 정보, 견적번호, 발행일/유효기간 영역
  - `src/components/invoice/InvoiceTable.tsx` 품목 테이블 (No., 서비스명, 수량, 단가, 금액 컬럼)
  - `src/components/invoice/InvoiceSummary.tsx` 공급가액, 부가세, 합계 금액 영역
  - `src/components/invoice/InvoiceFooter.tsx` 수신자 정보, 메모/참고사항 영역
  - A4 비율 (210mm x 297mm) 기준 레이아웃 및 색상 시스템 적용

- **Task 008: 견적서 뷰 통합 및 반응형 구현** [P0/F002]
  - `src/components/invoice/InvoiceView.tsx` 견적서 전체 레이아웃 통합 컴포넌트 구현
  - 데스크탑: A4 카드 중앙 정렬 (최대 너비 794px, 배경 `gray-50`, 카드 `white` + `shadow-lg`)
  - 모바일 (768px 미만): 전체 너비, 패딩 16px, 폰트 크기 축소
  - `src/app/invoice/[id]/loading.tsx` 스켈레톤 UI 구현 (로고, 텍스트, 테이블 3행, 합계 영역)
  - 로고 이미지 Next.js `<Image>` 컴포넌트 적용 및 alt 텍스트 접근성 처리
  - Playwright MCP로 데스크탑/모바일 반응형 렌더링 검증

- **Task 009: 오류 페이지 및 루트 페이지 UI** [P1/F005]
  - `src/app/invoice/[id]/not-found.tsx` 404 페이지 UI 구현 ("견적서를 찾을 수 없습니다" 안내)
  - `src/app/invoice/[id]/error.tsx` 500 에러 페이지 UI 구현 ("다시 시도" 버튼 포함, Client Component)
  - `src/app/page.tsx` 루트 안내 페이지 UI 구현 ("견적서 링크를 통해 접속해 주세요" 안내)
  - 각 오류 페이지에 일관된 디자인 시스템 적용

### Phase 4: PDF 생성 및 마무리

- **Task 010: PDF 다운로드 기능 구현** - 우선순위 [P0/F003]
  - `@react-pdf/renderer`의 `Font.register`로 Noto Sans KR `.ttf` 폰트 임베딩 설정
  - `src/components/invoice/InvoicePdfDocument.tsx` PDF 전용 문서 컴포넌트 구현 (A4 사이즈)
  - `src/app/api/invoice/[id]/pdf/route.ts` PDF 스트림 응답 Route Handler 구현
  - `src/components/invoice/PdfDownloadButton.tsx` PDF 다운로드 버튼 구현 (`aria-label="견적서 PDF 저장"`)
  - 파일명 형식 적용: `견적서_[프로젝트명]_[발행일].pdf` (UTF-8 인코딩)
  - Playwright MCP로 PDF 다운로드 버튼 클릭 및 파일 생성 검증

- **Task 011: URL 복사 및 토스트 알림 구현** [P1/F004]
  - `src/components/invoice/CopyLinkButton.tsx` URL 복사 버튼 구현 (`navigator.clipboard.writeText`)
  - 복사 완료 시 sonner 토스트 알림 표시 ("링크가 복사되었습니다")
  - `aria-label="견적서 링크 복사"` 접근성 속성 적용
  - 액션 바 컴포넌트 구현 (상단 sticky, 모바일 하단 고정)
  - Playwright MCP로 복사 버튼 클릭 및 토스트 표시 검증

- **Task 012: 통합 테스트 및 배포 준비** [P0]
  - `src/app/invoice/[id]/page.tsx`에 노션 API 연동 통합 (더미 데이터 교체)
  - `generateMetadata` 함수 구현 (견적서 제목 기반 동적 메타데이터)
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트 (조회 -> 확인 -> PDF 다운로드 -> 링크 복사)
  - `npm run check-all` 및 `npm run build` 성공 확인
  - `NOTION_API_KEY` 클라이언트 번들 미포함 검증
  - Vercel 배포 설정 및 환경변수 구성
