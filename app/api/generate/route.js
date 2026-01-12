import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { prompt } = body;

    // Validation: Check if prompt exists
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validation: Check if prompt is a string
    if (typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt must be a string' },
        { status: 400 }
      );
    }

    // Validation: Check if prompt is not empty
    if (prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt cannot be empty' },
        { status: 400 }
      );
    }

    console.log('🎨 Generating image with prompt:', prompt);

    // Call OpenAI DALL·E 2 API
    const response = await openai.images.generate({
      model: 'dall-e-2',        // Using DALL·E 2
      prompt: prompt,           // User's prompt
      n: 1,                     // Generate 1 image
      size: '512x512',          // 512x512 size
    });

    // Extract the image URL from response
    const imageUrl = response.data[0].url;

    console.log('✅ Image generated successfully');

    // Return success response
    return NextResponse.json(
      { imageUrl, prompt },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error generating image:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}