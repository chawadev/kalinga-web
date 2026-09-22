# Setup Instructions

## Environment Variables

The application requires the following environment variables to be set:

### For the Next.js Frontend

Create a `.env.local` file in the `web/kalinga-web` directory with:

```
MCP_SERVER_URL=http://localhost:8080/mcp
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Note:** We use `gemini-3.5-flash-lite` which has a limit of 500 requests per day (vs 20 for regular flash), giving you 25x more capacity.

### For the Go Backend

The Go MCP server is already configured to run on `http://localhost:8080/mcp`.

## Getting Started

1. **Start the Go MCP Server:**
   ```bash
   cd /Users/chawanangwa/Desktop/My Projects/Kalinga/backend/kalinga-backend
   go run cmd/server/main.go
   # or use the compiled binary
   ./server
   ```

2. **Configure Environment Variables:**
   - Copy the required environment variables to a `.env.local` file in the Next.js app directory
   - Replace `your_actual_gemini_api_key_here` with your actual Gemini API key

3. **Start the Next.js Development Server:**
   ```bash
   cd /Users/chawanangwa/Desktop/My Projects/Kalinga/web/kalinga-web
   npm run dev
   ```

4. **Access the Application:**
   - Open your browser to `http://localhost:3000`
   - The application should now be able to communicate with both the Gemini API and the Go MCP server

## Testing the Integration

Try sending messages like:
- "Check the server status"
- "Connect my mobile money account with phone number 1234567890 and provider MTN"
- "Build my financial profile for user user123"
- "Verify claim claim123 for amount $500 from merchant Amazon"

These should trigger the respective MCP tools and display the results in the chat interface and MCP log drawer.

## Rate Limits

- **Gemini 2.5 Flash Lite:** 500 requests/day (current model)
- **If you hit limits:** Wait for daily reset or consider upgrading to a paid Gemini plan
