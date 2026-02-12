/**
 * Email Sender - EmailJS integration (SDK v4.x)
 *
 * Uses emailjs.send() per https://www.emailjs.com/docs/sdk/send/
 * Sends contact form submissions to the configured recipient via EmailJS.
 *
 * Setup:
 * 1. Create account at https://www.emailjs.com
 * 2. Add an email service (Gmail, SendGrid, Hostinger, etc.)
 * 3. Create a template with variables: from_name, from_email, subject, message, phone, company_name, company_id, to_email
 * 4. In the template settings, set "To Email" to {{to_email}} (required — 422 if empty)
 * 5. Set env vars in .env.local: VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID
 *    Optional: VITE_EMAILJS_TO_EMAIL (default: joaomaia@jmsit.cloud)
 */

import emailjs, { EmailJSResponseStatus } from '@emailjs/browser'
import type { ContactFormData } from '../types/n8n'

const DEFAULT_RECIPIENT_EMAIL = 'joaomaia@jmsit.cloud'

function getConfig() {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const toEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL?.trim()
  return {
    publicKey,
    serviceId,
    templateId,
    toEmail: toEmail || DEFAULT_RECIPIENT_EMAIL
  }
}

function isConfigured(): boolean {
  const { publicKey, serviceId, templateId } = getConfig()
  return !!(publicKey?.trim() && serviceId?.trim() && templateId?.trim())
}

/**
 * Sends contact form data via EmailJS.
 * @throws Error if not configured or send fails
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const { publicKey, serviceId, templateId, toEmail } = getConfig()

  if (!publicKey?.trim() || !serviceId?.trim() || !templateId?.trim()) {
    throw new Error(
      'Email not configured. Set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID in .env.local'
    )
  }

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const logoUrl = websiteUrl ? `${websiteUrl}/img/logo.png` : ''

  const templateParams: Record<string, string> = {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    to_email: toEmail,
    website_url: websiteUrl,
    logo_url: logoUrl,
    time: typeof window !== 'undefined' ? new Date().toLocaleString() : '',
    ...(data.phone && { phone: data.phone }),
    ...(data.companyName && { company_name: data.companyName }),
    ...(data.companyIdentifier && { company_id: data.companyIdentifier })
  }

  if (import.meta.env.DEV) {
    console.debug(
      '[EmailJS] Sending to template',
      templateId,
      '| Ensure template "To Email" = {{to_email}} at dashboard.emailjs.com/admin/templates'
    )
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      blockHeadless: true,
      limitRate: { throttle: 5000 }
    })
  } catch (err) {
    if (err instanceof EmailJSResponseStatus && err.status === 422 && /recipient/i.test(err.text ?? '')) {
      throw new Error(
        'EMAILJS_RECIPIENT_EMPTY: EmailJS template "To Email" must be set to {{to_email}}. ' +
          'Go to dashboard.emailjs.com → Templates → Edit → set "To Email" to {{to_email}}'
      )
    }
    throw err
  }
}

export { isConfigured as isEmailConfigured, DEFAULT_RECIPIENT_EMAIL as RECIPIENT_EMAIL }
