import { GoogleGenAI } from "@google/genai";

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:8080/mcp";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

interface MCPToolCall {
  name: string;
  parameters: Record<string, any>;
}

interface MCPResponse {
  result?: any;
  error?: string;
  latency?: number;
}

async function callMCPTool(toolName: string, parameters: Record<string, any>): Promise<MCPResponse> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: parameters,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    if (data.error) {
      return {
        error: data.error.message || "MCP tool execution failed",
      };
    }

    return {
      result: data.result,
      latency,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown MCP error",
    };
  }
}

const TOOLS = [
  {
    name: "check_status",
    description: "Verifies connection health and returns server status",
    parametersJsonSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "connect_momo_account",
    description: "Connects a mobile money account with phone number and provider",
    parametersJsonSchema: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "The phone number to connect",
        },
        provider: {
          type: "string",
          description: "The mobile money provider (e.g., MTN, Airtel)",
        },
      },
      required: ["phone_number", "provider"],
    },
  },
  {
    name: "build_financial_profile",
    description: "Builds loan readiness and credit scores from transaction history",
    parametersJsonSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user identifier",
        },
      },
      required: ["user_id"],
    },
  },
  {
    name: "verify_claim",
    description: "Checks incoming refund/payment claims against suspicious transaction patterns",
    parametersJsonSchema: {
      type: "object",
      properties: {
        claim_id: {
          type: "string",
          description: "The claim identifier to verify",
        },
        amount: {
          type: "number",
          description: "The claim amount",
        },
        merchant: {
          type: "string",
          description: "The merchant name",
        },
      },
      required: ["claim_id", "amount", "merchant"],
    },
  },
];

export async function POST(request: Request) {
  try {
    if (!ai) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY environment variable is not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const logs: any[] = [];
    let toolResults: any[] = [];

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are Kalinga, a financial intelligence assistant. You help users manage their finances, connect mobile money accounts, build financial profiles, and verify claims. Always identify yourself as Kalinga when asked who you are.",
        tools: [{ functionDeclarations: TOOLS }],
      },
    });

    const functionCalls = result.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls as any[]) {
        const toolName = call.name;
        const parameters = call.args || {};

        logs.push({
          type: "tool_call",
          tool: toolName,
          parameters,
          timestamp: new Date().toISOString(),
        });

        const mcpResponse = await callMCPTool(toolName, parameters);

        logs.push({
          type: "tool_result",
          tool: toolName,
          result: mcpResponse.result || mcpResponse.error,
          latency: mcpResponse.latency,
          timestamp: new Date().toISOString(),
        });

        toolResults.push({
          name: toolName,
          response: mcpResponse.result || { error: mcpResponse.error },
        });
      }

      const followUpResult = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: [
          { role: "user", parts: [{ text: message }] },
          {
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: functionCalls[0].name,
                  response: toolResults[0].response,
                },
              },
            ],
          },
        ],
      });

      const text = followUpResult.text;

      return new Response(
        JSON.stringify({
          response: text,
          logs,
          toolCalls: functionCalls.map((call: any) => ({
            name: call.name,
            parameters: call.args,
          })),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const text = result.text;

    return new Response(
      JSON.stringify({
        response: text,
        logs,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
