import { describe, it, expect, vi, beforeEach } from 'vitest'
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser'
import { sendContactEmail, isEmailConfigured } from '../emailSender'

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn()
  },
  EmailJSResponseStatus: class {
    status: number
    text: string
    constructor(status: number, text: string) {
      this.status = status
      this.text = text
    }
  }
}))

const mockSend = vi.mocked(emailjs.send)

describe('emailSender', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('isEmailConfigured returns true when env vars are set (via vitest define)', () => {
    expect(isEmailConfigured()).toBe(true)
  })

  it('sendContactEmail calls emailjs.send with correct params', async () => {
    mockSend.mockResolvedValue({ status: 200, text: 'OK' } as never)

    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project inquiry',
      message: 'Hello!',
      phone: '+351912345678',
      companyName: 'Acme',
      companyIdentifier: '123'
    }

    await sendContactEmail(payload)

    expect(mockSend).toHaveBeenCalledWith(
      'test-service-id',
      'test-template-id',
      expect.objectContaining({
        from_name: 'John Doe',
        from_email: 'john@example.com',
        subject: 'Project inquiry',
        message: 'Hello!',
        to_email: 'joaomaia@jmsit.cloud',
        phone: '+351912345678',
        company_name: 'Acme',
        company_id: '123'
      }),
      expect.objectContaining({
        publicKey: 'test-public-key',
        blockHeadless: true,
        limitRate: { throttle: 5000 }
      })
    )
  })

  it('sendContactEmail throws helpful error on 422 recipients empty', async () => {
    mockSend.mockRejectedValue(new EmailJSResponseStatus(422, 'The recipients address is empty'))

    await expect(sendContactEmail({
      name: 'Jane',
      email: 'jane@test.com',
      subject: 'Hi',
      message: 'Message'
    })).rejects.toThrow('EMAILJS_RECIPIENT_EMPTY')
  })

  it('sendContactEmail omits optional fields when empty', async () => {
    mockSend.mockResolvedValue({ status: 200, text: 'OK' } as never)

    await sendContactEmail({
      name: 'Jane',
      email: 'jane@test.com',
      subject: 'Hi',
      message: 'Message'
    })

    const [, , templateParams] = mockSend.mock.calls[0]
    expect(templateParams).toEqual(
      expect.objectContaining({
        from_name: 'Jane',
        from_email: 'jane@test.com',
        subject: 'Hi',
        message: 'Message',
        to_email: 'joaomaia@jmsit.cloud'
      })
    )
    expect(templateParams).not.toHaveProperty('phone')
    expect(templateParams).not.toHaveProperty('company_name')
    expect(templateParams).not.toHaveProperty('company_id')
  })
})
