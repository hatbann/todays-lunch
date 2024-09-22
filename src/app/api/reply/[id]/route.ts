import Comment from '@/model/comment';
import { Reply } from '@/model/Reply';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const ids = params.id.split(',');
    const replies = await Reply.find({
      _id: { $in: ids },
    });

    return new NextResponse(
      JSON.stringify({
        message: 'OK',
        data: replies,
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}
