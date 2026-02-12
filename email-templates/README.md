# Email Templates

HTML email templates for the portfolio contact form. Compatible with [EmailJS](https://www.emailjs.com).

## Contact Form Template

**File:** `contact-form.html`

Layout matches the reference design:
- Yellow (`#ffc002`) header and footer with rounded corners
- White content area with sender details and message
- Inline styles only (no external CSS)
- No animations (email clients have limited support)
- EmailJS conditional blocks: `{{#variable}}...{{/variable}}` and `{{^variable}}...{{/variable}}`

### Template Variables

| Variable       | Required | Description                    |
|----------------|----------|--------------------------------|
| `from_name`    | Yes      | Sender full name               |
| `from_email`   | Yes      | Sender email (reply-to)        |
| `subject`      | Yes      | Message subject                |
| `message`      | Yes      | Message body                   |
| `to_email`     | Yes      | Recipient (joaomaia@jmsit.cloud) |
| `time`         | No       | Submission timestamp           |
| `website_url`  | No       | Portfolio URL (for logo link)  |
| `logo_url`     | No       | Logo image URL                 |
| `phone`        | No       | Sender phone (E.164)           |
| `company_name` | No       | Company name                   |
| `company_id`   | No       | VAT/tax ID                     |

### Setup in EmailJS

1. Create a new template in the [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. **To Email** (template settings, not in the HTML): Set to `{{to_email}}` or `joaomaia@jmsit.cloud`. If empty → 422 error.
3. **Subject:** `Portfolio: {{subject}}`
4. **Content:** Paste the full HTML from `contact-form.html` into the Content/Body field
5. Save the template and note the **Template ID**

**Note:** `contact-form.html` is the email body only. The "To Email" field is in the template's metadata/sidebar — it is separate from the HTML content.

### Email Client Compatibility

- **Inline styles only** — no `<style>` blocks or external CSS
- **No CSS animations** — `@keyframes`, `transition`, `animation` are stripped by most clients
- **Tables for layout** — used for the info grid (reliable across clients)
- **No JavaScript** — email clients do not execute JS
