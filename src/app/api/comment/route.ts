/** @format */

import { Reply } from '@/model/Reply';
import Comment from '@/model/comment';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const org = req.nextUrl.searchParams.get('org');
    if (org) {
      const comments = await Comment.find({ org: org }).sort({
        created_at: 1,
      });
      return new NextResponse(
        JSON.stringify({
          comments,
          message: 'success',
        }),
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify([]), { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newComment = new Comment(body);
    await newComment.save();
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}

// comment 수정하는 것
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id'); // comment _id
    const comment = await Comment.findOne({
      _id: id,
    });

    if (comment) {
      comment.content = body.content;
      comment.save();
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
    const comment = await Comment.findOne({
      _id: id,
    });

    const replyIds = comment?.replies;
    if (replyIds) {
      const reply = await Reply.deleteMany({ _id: { $in: replyIds } });
    }
    const res = await Comment.deleteOne({ _id: id });
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}
