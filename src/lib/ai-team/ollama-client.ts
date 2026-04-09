// Ollama Client Connector

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: true;
}

export async function askOllama(
  prompt: string, 
  systemPrompt: string, 
  model: string = 'llama3'
): Promise<string> {
  const url = 'http://localhost:11434/api/generate';
  
  // Combine System Prompt and User Prompt for standard text generation
  const fullPrompt = `${systemPrompt}\n\nTask Instructions:\n${prompt}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        stream: false, 
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return data.response;
  } catch (error) {
    console.error("Failed to connect to Ollama. Make sure 'ollama serve' is running.", error);
    throw error;
  }
}
