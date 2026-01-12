import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // 1. Validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Generate Image URL (Using Picsum for reliable real photos)
    // We use the prompt length or random math to create a "seed" 
    // This ensures you get different images for different actions
    const seed = Math.floor(Math.random() * 100000) + prompt.length;
    
    // This URL returns a real 512x512 photo
    const imageUrl = `https://picsum.photos/seed/${seed}/512/512`;

    // Simulate a slight network delay (so your loading spinner shows up)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Return the URL
    return NextResponse.json({ 
      imageUrl, 
      prompt 
    }, { status: 200 });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}