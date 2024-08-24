import Recipe from '@/model/recipe';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const recipe = await Recipe.find({
      author: params.id,
    });

    return new NextResponse(
      JSON.stringify({
        message: 'Ok',
        data: recipe,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return Response.error();
  }
}
