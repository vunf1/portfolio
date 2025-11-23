# n8n Webhook Test Script

Quick testing tool for sending authenticated requests to n8n webhook endpoints.

**Available Scripts:**
- `send-test-request.ts` - TypeScript/Node.js version (flexible, supports CLI args)
- `send-test-request.ps1` - PowerShell version (Windows, uses hardcoded test data)

## Prerequisites

1. **Environment Variables**: Create a `.env` or `.env.local` file in the project root with:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   VITE_N8N_AUTH_TOKEN=your-authentication-token
   ```

   Alternatively, you can use non-prefixed variable names:
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   N8N_AUTH_TOKEN=your-authentication-token
   ```

2. **Dependencies**: Ensure `dotenv` is installed (already in project dependencies)

## Usage

### PowerShell Script (Windows)

The PowerShell script sends the predefined test data:

```powershell
.\tools\n8n-test\send-test-request.ps1
```

The script:
- Reads webhook URL and auth token from `.env` or `.env.local` file
- Sends the predefined test data (João Alexandre de Oliveira Maia)
- Automatically converts data to `ContactFormData` format
- Shows success/failure status

### TypeScript Script (Cross-platform)

#### Send Single Request from CLI

```bash
npm run test:n8n -- --data '{"Name":"John Doe","Email":"john@example.com","Subject":"Test","Message":"Hello"}'
```

### Send from JSON File

```bash
npm run test:n8n -- --file example-data.json
```

### Send Multiple Requests from Array

If your JSON file contains an array of objects:

```bash
npm run test:n8n -- --file example-data.json --multiple
```

### Override Webhook URL

You can override the webhook URL from the command line (auth token still comes from env):

```bash
npm run test:n8n -- --data '{"Name":"..."}' --webhook-url https://different-webhook.com/webhook/test
```

### Add Delay Between Requests

When sending multiple requests, add a delay (in milliseconds) between them:

```bash
npm run test:n8n -- --file example-data.json --multiple --delay 2000
```

## Data Format

The script accepts data in two formats:

### User-Friendly Format (Auto-Mapped)

```json
{
  "Name": "John Doe",
  "Email": "john@example.com",
  "Phone": "+351912345678",
  "CompanyName": "Acme Corp",
  "CompanyID": "123456789",
  "Subject": "Project Inquiry",
  "Message": "Hello, I'm interested in..."
}
```

### ContactFormData Format (Direct)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+351912345678",
  "companyName": "Acme Corp",
  "companyIdentifier": "123456789",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Field Mapping:**
- `Name` → `name` (required)
- `Email` → `email` (required)
- `Phone` → `phone` (optional)
- `CompanyName` → `companyName` (optional)
- `CompanyID` → `companyIdentifier` (optional)
- `Subject` → `subject` (required)
- `Message` → `message` (required)
- `timestamp` is auto-generated if not provided

## Command Line Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `--data <json>` | JSON data as string | Yes* |
| `--file <path>` | Path to JSON file | Yes* |
| `--multiple` | Treat file content as array | No |
| `--webhook-url <url>` | Override webhook URL | No |
| `--delay <ms>` | Delay between requests (default: 1000ms) | No |

*Either `--data` or `--file` is required

## Examples

### Example 1: Quick Test

```bash
npm run test:n8n -- --data '{"Name":"Test User","Email":"test@example.com","Subject":"Test","Message":"This is a test"}'
```

### Example 2: From File

```bash
npm run test:n8n -- --file example-data.json
```

### Example 3: Multiple Requests with Delay

```bash
npm run test:n8n -- --file example-data.json --multiple --delay 2000
```

### Example 4: Custom Webhook

```bash
npm run test:n8n -- --file example-data.json --webhook-url https://staging.n8n.com/webhook/test
```

## Output

The script provides colored console output showing:
- Webhook URL and auth token (masked)
- Number of requests to send
- Progress for each request
- Success/failure status
- Response data (if available)
- Error messages (if any)

## Error Handling

The script will:
- Validate that required environment variables are set
- Validate that all required fields are present in the data
- Show clear error messages for missing or invalid data
- Continue processing remaining requests if one fails (when sending multiple)

## Security Notes

- **Never commit** `.env` or `.env.local` files with real credentials
- The auth token is masked in console output (only first 8 characters shown)
- Webhook URLs and tokens are loaded from environment variables only (never hardcoded)

