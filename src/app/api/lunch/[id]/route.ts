/** @format */

import Lunch from '@/model/lunch';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const lunch = await Lunch.findOne({
      _id: params.id,
    });

    return new NextResponse(JSON.stringify({ lunch }), { status: 200 });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return Response.error();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const lunch = await Lunch.findOne({
      _id: params.id,
    });
    const data = await req.json();
    lunch.title = data.title;
    lunch.content = data.content;
    /*     lunch.img = data.img; */
    await lunch.save();
    return new NextResponse(
      JSON.stringify({
        message: 'OK',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return Response.error();
  }
}
