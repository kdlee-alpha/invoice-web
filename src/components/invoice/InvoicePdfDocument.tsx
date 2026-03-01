import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Invoice } from '@/types/invoice'

// Noto Sans KR 폰트 등록 (한글 지원)
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.0.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.6.woff2',
      fontWeight: 'bold',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  senderInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  smallText: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 6,
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 2,
  },
  divider: {
    borderBottom: '1pt solid #e5e7eb',
    marginBottom: 16,
    marginTop: 16,
  },
  receiverLabel: {
    fontSize: 8,
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 4,
  },
  receiverName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #f3f4f6',
    paddingVertical: 4,
  },
  colNo: { width: '8%', color: '#6b7280' },
  colName: { width: '42%' },
  colQty: { width: '10%', textAlign: 'right' },
  colUnitPrice: { width: '20%', textAlign: 'right' },
  colAmount: { width: '20%', textAlign: 'right' },
  headerText: { fontSize: 9, color: '#6b7280', fontWeight: 'bold' },
  summaryContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 9, color: '#6b7280' },
  summaryValue: { fontSize: 9, color: '#374151' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 4,
    marginTop: 4,
  },
  totalLabel: { fontSize: 11, fontWeight: 'bold' },
  totalValue: { fontSize: 11, fontWeight: 'bold' },
  memoLabel: {
    fontSize: 8,
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 4,
  },
  memoText: { fontSize: 9, color: '#4b5563' },
  validText: { fontSize: 8, color: '#9ca3af', marginTop: 8 },
})

/** 원화 형식으로 금액 포맷 */
function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

interface InvoicePdfDocumentProps {
  invoice: Invoice
}

/** @react-pdf/renderer 기반 PDF 문서 컴포넌트 */
export function InvoicePdfDocument({ invoice }: InvoicePdfDocumentProps) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )
  const tax = Math.round(subtotal * (invoice.taxRate / 100))
  const total = subtotal + tax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.senderInfo}>
            <Text style={styles.companyName}>{invoice.sender.companyName}</Text>
            {invoice.sender.email ? (
              <Text style={styles.smallText}>{invoice.sender.email}</Text>
            ) : null}
            {invoice.sender.phone ? (
              <Text style={styles.smallText}>{invoice.sender.phone}</Text>
            ) : null}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>견적서</Text>
            {invoice.invoiceNumber ? (
              <Text style={styles.invoiceMeta}>
                견적번호: {invoice.invoiceNumber}
              </Text>
            ) : null}
            <Text style={styles.invoiceMeta}>발행일: {invoice.issuedAt}</Text>
            {invoice.validUntil ? (
              <Text style={styles.invoiceMeta}>
                유효기간: {invoice.validUntil}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 수신자 */}
        <View>
          <Text style={styles.receiverLabel}>수신</Text>
          <Text style={styles.receiverName}>
            {invoice.receiver.companyName}
          </Text>
          {invoice.receiver.contactName ? (
            <Text style={styles.smallText}>
              {invoice.receiver.contactName} 귀중
            </Text>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* 품목 테이블 */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colNo, styles.headerText]}>No.</Text>
            <Text style={[styles.colName, styles.headerText]}>서비스명</Text>
            <Text style={[styles.colQty, styles.headerText]}>수량</Text>
            <Text style={[styles.colUnitPrice, styles.headerText]}>단가</Text>
            <Text style={[styles.colAmount, styles.headerText]}>금액</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colNo}>{index + 1}</Text>
              <Text style={styles.colName}>{item.name}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colUnitPrice}>
                {formatKRW(item.unitPrice)}
              </Text>
              <Text style={styles.colAmount}>
                {formatKRW(item.qty * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* 합계 */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>공급가액</Text>
            <Text style={styles.summaryValue}>{formatKRW(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>부가세({invoice.taxRate}%)</Text>
            <Text style={styles.summaryValue}>{formatKRW(tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>합 계</Text>
            <Text style={styles.totalValue}>{formatKRW(total)}</Text>
          </View>
        </View>

        {/* 하단 메모 */}
        {invoice.memo || invoice.validUntil ? (
          <>
            <View style={styles.divider} />
            {invoice.memo ? (
              <View>
                <Text style={styles.memoLabel}>참고사항</Text>
                <Text style={styles.memoText}>{invoice.memo}</Text>
              </View>
            ) : null}
            {invoice.validUntil ? (
              <Text style={styles.validText}>
                본 견적서는 {invoice.validUntil}까지 유효합니다.
              </Text>
            ) : null}
          </>
        ) : null}
      </Page>
    </Document>
  )
}
