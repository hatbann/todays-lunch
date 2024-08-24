import Lunch from '@/model/lunch';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const lunch = await Lunch.find({
      author: params.id,
    });

    return new NextResponse(
      JSON.stringify({
        message: 'Ok',
        data: lunch,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return Response.error();
  }
}
