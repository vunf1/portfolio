# EmailJS Setup — Contact Form

The contact form sends emails to the configured recipient (default: **joaomaia@jmsit.cloud**) via [EmailJS](https://www.emailjs.com) over HTTPS. EmailJS and the connected provider handle TLS/encryption in transit.

## Why `.env.local` in development?

Vite loads env files in this order (later overrides earlier):

- `.env` — base, committed to git
- `.env.local` — **local overrides, git-ignored** ← use for real credentials
- `.env.development` / `.env.production` — mode-specific
- `.env.[mode].local` — mode-specific local

In development (`npm run dev`), `.env.local` takes precedence, so your real EmailJS keys there are used. Never commit `.env.local`.

## 1. Create EmailJS Account

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. Verify your email

## 2. Add Email Service

1. Go to **Email Services** → **Add New Service**
2. Connect one of the supported providers (Gmail, SendGrid, Outlook, etc.)
3. Use TLS-enabled SMTP or the provider’s API
4. Save and note your **Service ID**

## 3. Create Email Template

1. Go to **Email Templates** → **Create New Template**
2. **Required:** Set **To Email** to `{{to_email}}` — if empty, you get 422 "recipients address is empty"
3. Set **Subject** to `Portfolio: {{subject}}`
4. For **Content**, copy the HTML from `email-templates/contact-form.html` in this repo

   The template uses the reference layout (yellow header/footer, white content) and displays:
   - Sender name, email, subject
   - Optional: phone, company (with VAT/ID)
   - Message body with reply link

5. Template variables (see `email-templates/README.md` for full list):

   | Variable         | Description        |
   |------------------|--------------------|
   | `from_name`      | Sender name        |
   | `from_email`     | Reply-to address   |
   | `subject`        | Subject line       |
   | `message`        | Message body       |
   | `to_email`       | Recipient          |
   | `website_url`    | Portfolio URL      |
   | `logo_url`       | Logo image URL     |
   | `phone`          | Phone (optional)   |
   | `company_name`   | Company (optional) |
   | `company_id`     | VAT/ID (optional)  |

6. Save and note your **Template ID**

## 4. Get Public Key

1. Go to **Account** → **API Keys** (or **General**)
2. Copy your **Public Key**

## 5. Configure Environment

Create `.env.local` (or `.env.production` for production):

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
# Optional: override recipient (default: joaomaia@jmsit.cloud)
# VITE_EMAILJS_TO_EMAIL=your@email.com
```

For production, set these in your hosting platform’s environment (e.g. GitHub Actions secrets, Vercel env vars).

### Troubleshooting: 422 "The recipients address is empty"

The template's **To** / **To Email** field is empty. Fix in one of two ways:

**Option A — Dynamic (recommended)**  
1. Open [dashboard.emailjs.com/admin/templates](https://dashboard.emailjs.com/admin/templates)
2. Open the template whose ID matches `VITE_EMAILJS_TEMPLATE_ID` in `.env.local`
3. Find the **To Email** (or **To**) input — usually in the right sidebar or "Email" section
4. Type exactly: `{{to_email}}` (double curly braces, underscore, no spaces)
5. **Save** the template (top-right)

**Option B — Hardcoded**  
If dynamic fails, set **To Email** to the fixed address: `joaomaia@jmsit.cloud`  
(You lose the ability to override via `VITE_EMAILJS_TO_EMAIL`, but it works.)

**Verify you’re editing the right template**  
In dev, the console logs `[EmailJS] Sending to template <YOUR_TEMPLATE_ID>`. That ID must match `VITE_EMAILJS_TEMPLATE_ID` in `.env.local`. Edit the template with that exact ID.

**Test with diagnostic page** — Run `npm run dev`, open `http://localhost:3000/emailjs-test.html`, paste your keys from `.env.local`, and click Send. If you get 422 there too, the template's "To Email" is wrong.

## Security & Rate Limiting

- Uses only the **public key** in the browser (no private keys)
- `blockHeadless: true` reduces automated abuse
- `limitRate: { throttle: 5000 }` (5 seconds between sends per page)
- All traffic over HTTPS; TLS provided by EmailJS and the email provider

## Package

- **@emailjs/browser** v4.4.1 — latest official SDK ([docs](https://www.emailjs.com/docs/sdk/send/))
- Uses `emailjs.send(serviceID, templateID, templateParams, options)` per official API
- No server needed for basic contact forms
