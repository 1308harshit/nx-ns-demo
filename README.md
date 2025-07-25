# Email Service

A robust email service with multiple providers, circuit breaker pattern, and rate limiting capabilities.

## Features

- Multiple email providers with failover
- Circuit breaker pattern for fault tolerance
- Rate limiting per provider
- Exponential backoff retry mechanism
- REST API endpoints
- Health check for deployment platforms

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
npm install
```

### Running Locally
```bash
# Run the web server
npm start

# Or run the original test script
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Send Email
```
POST /send-email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "body": "This is a test email",
  "id": "optional-email-id"
}
```

### Get Service Status
```
GET /status
```
Returns current service status including provider failures and circuit breaker status.

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` configuration
4. Deploy with one click

### Option 2: Manual Configuration

1. Create a new Web Service on Render
2. Connect your Git repository
3. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

### Environment Variables

The following environment variables can be configured in Render:

- `PORT`: Port number (default: 3000)
- `NODE_ENV`: Environment (production/development)

## Testing

Run the test suite:
```bash
npm test
```

## Architecture

The service uses:
- **EmailService**: Main orchestrator with queue management
- **EmailProvider**: Individual email providers with rate limiting
- **Circuit Breaker**: Prevents cascading failures
- **Exponential Backoff**: Intelligent retry mechanism

## License

ISC


