import { ChatRequest, ChatResponse } from "@/types/chat";

const API_URL = "https://accountingai-production.up.railway.app/chat";

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
    throw new Error('Unknown error occurred when sending message');
  }
}
