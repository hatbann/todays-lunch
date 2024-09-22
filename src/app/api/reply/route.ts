import Comment from '@/model/comment';
import { Reply } from '@/model/Reply';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newReply = new Reply(body);

    const org = body.org;
    if (org) {
      const orgComment = await Comment.findOne({ _id: org });
      console.log(orgComment);
      if (orgComment) {
        orgComment.replies = orgComment.replies.concat(newReply._id);
        await orgComment.save();
      }

      await newReply.save();
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed' }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id'); // comment _id
    const reply = await Reply.findOne({
      _id: id,
    });

    if (reply) {
      reply.content = body.content;
      reply.save();
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed' }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get('id'); // comment _id

    const reply = await Reply.findOne({
      _id: id,
    });

    const org = reply?.org;
    if (org) {
      const orgComment = await Comment.findOne({ _id: org });
      if (orgComment) {
        orgComment.replies = orgComment.replies.filter(
          (replyId: string) => replyId !== id
        );
        await orgComment.save();
      }
    }

    const res = await Reply.deleteOne({ _id: id });
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}
