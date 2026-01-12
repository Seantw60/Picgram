import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { imageUrl, prompt } = body;

    // Validation: Check if both fields are missing
    if (!imageUrl && !prompt) {
      return NextResponse.json(
        { error: 'imageUrl and prompt are required' },
        { status: 400 }
      );
    }

    // Validation: Check if imageUrl is missing
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required' },
        { status: 400 }
      );
    }

    // Validation: Check if prompt is missing
    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // Validation: Check if imageUrl is empty string
    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'imageUrl cannot be empty' },
        { status: 400 }
      );
    }

    // Validation: Check if prompt is a string (empty string is allowed per requirements)
    if (typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt must be a string' },
        { status: 400 }
      );
    }

    console.log('📤 Publishing image to database...');
    console.log('  imageUrl:', imageUrl);
    console.log('  prompt:', prompt);

    // Create the published image in the database
    // hearts defaults to 0, createdAt defaults to now()
    const publishedImage = await prisma.publishedImage.create({
      data: {
        imageUrl,
        prompt,
      },
    });

    console.log('✅ Image published successfully! ID:', publishedImage.id);

    // Return the created record with 201 Created status
    return NextResponse.json(publishedImage, { status: 201 });

  } catch (error) {
    console.error('❌ Error publishing image:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to publish image', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}