/**
 * Centralized client-side environment variables.
 * All VITE_* vars are read via import.meta.env (inlined at build time by Vite).
 * Used by: contact form (EmailJS), n8n webhook client.
 *
 * For EasyPanel/Docker: ensure these vars are set at BUILD time
 * (when running `npm run build`), not only at runtime.
 *
 * Uses explicit import.meta.env.VITE_* access (same as n8nClient) so Vite
 * correctly inlines values at build time.
 */

/** EmailJS config for contact form modal – same access pattern as n8n */
export function getEmailJsConfig() {
  return {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    toEmail: import.meta.env.VITE_EMAILJS_TO_EMAIL?.trim(),
    /** Explicit logo URL for email header; when set, used for logo_url instead of deriving from website */
    logoUrl: import.meta.env.VITE_EMAILJS_LOGO_URL?.trim()
  }
}

/** n8n webhook config */
export function getN8nConfig() {
  return {
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL,
    authToken: import.meta.env.VITE_N8N_AUTH_TOKEN || import.meta.env.VITE_N8N_JWT_TOKEN
  }
}
