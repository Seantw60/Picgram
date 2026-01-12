import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

// GET /api/feed - Retrieve paginated feed of images
export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    
    // Parse page and limit with defaults
    let page = parseInt(searchParams.get('page')) || 1;
    let limit = parseInt(searchParams.get('limit')) || 10;

    console.log('📥 GET /api/feed - page:', page, 'limit:', limit);

    // Validation: Page must be positive
    if (page <= 0) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    // Validation: Limit must be positive
    if (limit <= 0) {
      return NextResponse.json(
        { error: 'Limit must be greater than 0' },
        { status: 400 }
      );
    }

    // Cap limit at 50
    if (limit > 50) {
      limit = 50;
    }

    // Calculate pagination offset
    const skip = (page - 1) * limit;

    // Get total count of images
    const total = await prisma.publishedImage.count();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    console.log('📊 Total images:', total, 'Total pages:', totalPages);

    // Fetch paginated images, ordered by newest first
    const images = await prisma.publishedImage.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Newest first
      },
    });

    console.log('✅ Returning', images.length, 'images');

    // Return paginated response
    return NextResponse.json(
      {
        images,
        total,
        page,
        totalPages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error fetching feed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch feed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/feed - Update hearts count for an image
export async function PUT(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { id, hearts } = body;

    console.log('💝 PUT /api/feed - Updating hearts for image ID:', id, 'to:', hearts);

    // Validation: Check if id exists
    if (id === undefined || id === null) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // Validation: Check if hearts exists
    if (hearts === undefined || hearts === null) {
      return NextResponse.json(
        { error: 'hearts is required' },
        { status: 400 }
      );
    }

    // Validation: Check if id is a number
    if (typeof id !== 'number') {
      return NextResponse.json(
        { error: 'id must be a number' },
        { status: 400 }
      );
    }

    // Validation: Check if hearts is a number
    if (typeof hearts !== 'number') {
      return NextResponse.json(
        { error: 'hearts must be a number' },
        { status: 400 }
      );
    }

    // Validation: Check if hearts is non-negative
    if (hearts < 0) {
      return NextResponse.json(
        { error: 'hearts must be non-negative' },
        { status: 400 }
      );
    }

    // Attempt to update the image (atomic operation)
    try {
      const updatedImage = await prisma.publishedImage.update({
        where: { id },
        data: { hearts },
      });

      console.log('✅ Hearts updated successfully');

      return NextResponse.json(updatedImage, { status: 200 });

    } catch (prismaError) {
      // Check if error is due to record not found (Prisma error code P2025)
      if (prismaError.code === 'P2025') {
        console.log('❌ Image not found with ID:', id);
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }
      // Re-throw other Prisma errors
      throw prismaError;
    }

  } catch (error) {
    console.error('❌ Error updating hearts:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update hearts', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}