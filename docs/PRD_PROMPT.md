# 견적서 웹 서비스 MVP PRD 생성 메타 프롬프트

> **사용 방법**: 아래 프롬프트를 Claude Code의 `prd-generator` 에이전트에 그대로 전달하면
> `docs/PRD.md` 파일로 MVP PRD 문서가 자동 생성됩니다.

---

## 메타 프롬프트 (복사하여 사용)

```
당신은 솔로 개발자를 위한 실용적인 PRD 작성 전문가입니다.
아래 요구사항을 바탕으로 개발 즉시 착수 가능한 MVP PRD 문서를 작성해 주세요.

---

## 프로젝트 개요

**서비스명**: 견적서 웹 뷰어 (Invoice Web Viewer)

**핵심 가치**:
노션(Notion)에서 작성한 견적 정보를 클라이언트가 웹 브라우저로 확인하고
PDF로 다운로드할 수 있는 가장 간단한 MVP를 만든다.

**타겟 사용자**:
- 발신자(Sender): 프리랜서, 1인 사업자, 소규모 에이전시 — 노션으로 견적 내용 입력
- 수신자(Client): 고객사 담당자 — 링크를 받아 웹에서 견적서 확인 및 PDF 저장

---

## 기술 스택 (고정값, 변경 불가)

- Framework: Next.js 15.5.3 (App Router + Turbopack)
- Runtime: React 19.1.0 + TypeScript 5
- Styling: TailwindCSS v4 + shadcn/ui (new-york style)
- Forms: React Hook Form + Zod + Server Actions
- UI Components: Radix UI + Lucide Icons
- 외부 연동: Notion API (공식 SDK: @notionhq/client)
- PDF 생성: @react-pdf/renderer 또는 html2canvas + jsPDF (선택)
- 배포: Vercel

---

## MVP 범위 (Scope)

### 포함 기능 (In Scope)

1. **노션 데이터베이스 연동**
   - 노션 데이터베이스 ID와 API Key를 환경변수로 설정
   - 견적서 1건의 데이터를 노션 페이지(행)에서 읽어옴
   - 읽어올 필드: 프로젝트명, 발신자 정보, 수신자 정보, 품목 목록(서비스명/수량/단가), 발행일, 유효기간, 메모

2. **견적서 웹 뷰 페이지**
   - URL 구조: `/invoice/[id]` — 노션 페이지 ID 또는 슬러그 기반
   - 브라우저에서 견적서를 인쇄물처럼 미려하게 렌더링
   - A4 비율 레이아웃, 반응형(모바일 가독성 확보)
   - 발신자 로고/서명 이미지 표시 (노션 파일 필드 활용)

3. **PDF 다운로드**
   - "PDF 저장" 버튼 클릭 시 견적서를 PDF로 즉시 다운로드
   - 파일명 형식: `견적서_[프로젝트명]_[발행일].pdf`
   - A4 사이즈, 한글 폰트 지원 필수

4. **링크 공유**
   - 클라이언트에게 전달할 견적서 URL 생성
   - URL 복사 버튼 제공

### 제외 기능 (Out of Scope — v2 이후)

- 회원가입/로그인 인증
- 견적서 목록/대시보드 관리
- 클라이언트의 견적 승인/반려 워크플로우
- 이메일 발송 자동화
- 견적서 직접 편집 UI (노션이 편집 도구)
- 결제 연동

---

## 핵심 사용자 시나리오

### 시나리오 A — 발신자 (노션 사용자)
1. 노션 데이터베이스에 견적서 새 행 추가
2. 필드(프로젝트명, 품목, 단가 등)를 채움
3. 해당 행의 노션 페이지 ID를 복사
4. 웹서비스 URL에 ID를 붙여 클라이언트에게 링크 전송: `https://your-domain.com/invoice/[notion-page-id]`

### 시나리오 B — 수신자 (클라이언트)
1. 링크를 클릭해 견적서 웹 페이지 접속
2. 견적 내용 확인 (품목, 금액, 조건 등)
3. "PDF 저장" 버튼으로 로컬에 저장

---

## 노션 데이터베이스 스키마 (예시)

아래 필드 구조를 기준으로 PRD에 데이터 모델을 정의해 주세요.

| 필드명 | 노션 타입 | 설명 |
|--------|-----------|------|
| 프로젝트명 | Title | 견적서 제목 |
| 견적번호 | Text | 예: INV-2024-001 |
| 발행일 | Date | 견적서 발행 날짜 |
| 유효기간 | Date | 견적 유효 만료일 |
| 발신자_회사명 | Text | 발신 회사/개인 이름 |
| 발신자_이메일 | Email | 연락처 이메일 |
| 발신자_연락처 | Phone | 연락처 전화번호 |
| 수신자_회사명 | Text | 클라이언트 회사명 |
| 수신자_담당자 | Text | 클라이언트 담당자명 |
| 품목_목록 | Rich Text | JSON 형태로 저장: [{name, qty, unit_price}] |
| 세율 | Number | 부가세율 (예: 10) |
| 메모 | Rich Text | 하단 참고사항 |
| 로고_이미지 | Files & Media | 발신자 로고 파일 |
| 상태 | Select | draft / sent / accepted |

---

## 페이지 구조 및 라우팅

```
/                        → 랜딩 또는 리다이렉트 (MVP에서는 최소화)
/invoice/[id]            → 견적서 뷰 (메인 기능)
/invoice/[id]/pdf        → PDF 다운로드 처리 엔드포인트 (선택)
```

---

## 비기능 요구사항

- **성능**: 노션 API 응답 후 2초 이내 초기 렌더링
- **캐싱**: Next.js `revalidate` 또는 `unstable_cache`로 노션 데이터 60초 캐싱
- **보안**: 노션 API Key는 서버 사이드에서만 사용 (클라이언트에 노출 금지)
- **접근성**: PDF 다운로드 버튼 aria-label 필수
- **한글 지원**: PDF 렌더링 시 Noto Sans KR 폰트 임베딩
- **에러 처리**: 노션 페이지 ID가 없거나 접근 불가 시 적절한 에러 페이지 표시

---

## 환경변수 목록

```env
NOTION_API_KEY=           # 노션 통합 시크릿 키
NOTION_DATABASE_ID=       # 대상 데이터베이스 ID
NEXT_PUBLIC_BASE_URL=     # 배포 도메인 URL
```

---

## PRD 문서 작성 지침

위 내용을 바탕으로 `docs/PRD.md` 파일에 다음 구조로 PRD를 작성해 주세요:

1. **프로젝트 개요** — 배경, 목적, 성공 지표(KPI)
2. **사용자 정의** — 페르소나 2개 (발신자 / 수신자)
3. **기능 요구사항** — 우선순위(P0/P1/P2)와 함께 기능 명세
4. **데이터 모델** — 노션 스키마 기반 TypeScript 인터페이스 정의
5. **API 설계** — Next.js Server Actions / Route Handlers 엔드포인트 목록
6. **UI/UX 요구사항** — 페이지별 와이어프레임 텍스트 설명
7. **비기능 요구사항** — 성능, 보안, 접근성
8. **개발 환경 설정** — 환경변수, 노션 연동 초기 설정 방법
9. **MVP 완료 기준** — Done 조건 체크리스트
10. **향후 로드맵** — v2, v3 계획

**중요 규칙**:
- 모든 문서는 한국어로 작성
- 코드 예시는 TypeScript로 작성
- 솔로 개발자 기준 — 불필요한 복잡성 제거
- 즉시 개발 착수 가능한 수준의 구체성 유지
- 파일 경로: `docs/PRD.md`
```

---

## 사용 예시

Claude Code 대화창에서 다음과 같이 입력하세요:

```
위 메타 프롬프트를 prd-generator 에이전트에 전달해서 docs/PRD.md를 생성해줘
```

또는 이 파일의 "메타 프롬프트" 코드 블록 내용을 직접 복사하여 붙여넣기 하세요.

---

## 관련 문서

- 프로젝트 구조: `docs/guides/project-structure.md`
- 스타일링 가이드: `docs/guides/styling-guide.md`
- 컴포넌트 패턴: `docs/guides/component-patterns.md`
- Next.js 15 가이드: `docs/guides/nextjs-15.md`
- 폼 처리 가이드: `docs/guides/forms-react-hook-form.md`
