import { NextResponse } from 'next/server';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

// Helper function to chunk large text into smaller pieces
function chunkText(text: string, chunkSize: number): string[] {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    chunks.push(text.slice(startIndex, startIndex + chunkSize));
    startIndex += chunkSize;
  }

  return chunks;
}

export async function POST(request: Request) {
  console.log('Received request in /api/summarize');

  try {
    const { text } = await request.json();
    console.log('Received text:', text.substring(0, 100) + '...');

    // Validating  input
    if (!text || typeof text !== 'string') {
      console.log('Invalid input received');
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Seting chunk size and creating text chunks (500 characters per chunk)
    const CHUNK_SIZE = 500;
    const chunks = chunkText(text, CHUNK_SIZE);
    console.log(`Text split into ${chunks.length} chunks`);

    let finalSummary = ''; // To store the final concatenated summary

    // Looping over each chunk and sending it to Hugging Face API
    for (const chunk of chunks) {
      console.log('Sending chunk to Hugging Face API:', chunk.substring(0, 100) + '...');
      
      const response = await fetch(HUGGING_FACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: chunk }),
      });

      console.log('Received response from Hugging Face API with status:', response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Hugging Face API error:', errorBody);
        return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
      }

      const result = await response.json();
      const summary = result[0]?.summary_text || 'No summary generated for this chunk';

      // Add the chunk's summary to the final summary
      finalSummary += summary + ' ';
    }

    // Returning the final concatenated summary
    return NextResponse.json({ summary: finalSummary.trim() });
  } catch (error) {
    console.error('Detailed error in /api/summarize:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
