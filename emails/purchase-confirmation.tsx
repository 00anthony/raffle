// emails/purchase-confirmation.tsx
import { Html, Head, Body, Container, Heading, Text, Row, Column, Hr } from '@react-email/components'

type PurchaseConfirmationEmailProps = {
  buyerName: string
  raffleTitle: string
  drawingDate: string
  ticketDisplayIds: string[]
  amountPaid: number
  confirmationUrl: string
}

export function PurchaseConfirmationEmail({
  buyerName, raffleTitle, drawingDate, ticketDisplayIds, amountPaid, confirmationUrl,
}: PurchaseConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#1B3A2F', fontFamily: 'monospace', padding: '32px 0' }}>
        <Container style={{ backgroundColor: '#F7F0DE', padding: '32px', maxWidth: '480px' }}>
          <Heading style={{ color: '#24211B', fontSize: '22px' }}>Thank you, {buyerName}!</Heading>
          <Text style={{ color: '#24211B' }}>
            You're entered in <strong>{raffleTitle}</strong>. Here's your confirmation.
          </Text>
          <Hr />
          <Text style={{ color: '#7C9683', fontSize: '12px', textTransform: 'uppercase' }}>
            Your Ticket{ticketDisplayIds.length > 1 ? 's' : ''}
          </Text>
          <Text style={{ color: '#24211B', fontSize: '16px', fontWeight: 600 }}>
            {ticketDisplayIds.join('  ·  ')}
          </Text>
          <Hr />
          <Row>
            <Column>
              <Text style={{ color: '#7C9683', fontSize: '12px' }}>Drawing Date</Text>
              <Text style={{ color: '#24211B' }}>{drawingDate}</Text>
            </Column>
            <Column>
              <Text style={{ color: '#7C9683', fontSize: '12px' }}>Amount Paid</Text>
              <Text style={{ color: '#24211B' }}>${amountPaid.toFixed(2)}</Text>
            </Column>
          </Row>
          <Hr />
          <Text style={{ color: '#24211B' }}>
            View your full confirmation any time: <a href={confirmationUrl}>{confirmationUrl}</a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PurchaseConfirmationEmail