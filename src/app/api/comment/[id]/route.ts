/** @format */

import Comment from '@/model/comment';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { InferSchemaType } from 'mongoose';

/* export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const org_comment = await Comment.findOne({ _id: params.id });

    if (org_comment) {
      const newReply = new Reply({
        content: body.content,
        author: body.author,
        authorName: body.authorName,
      });
      console.log(newReply);
      await newReply.save();
      org_comment.replies.push(newReply);
      await org_comment.save();
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed' }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
} */

// reply 수정하는 것
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id'); // reply _id
    const comment = await Comment.findOne({
      _id: params.id,
    });
    if (comment) {
      const reply = comment.replies.find((reply: any) => reply._id == id);
      if (reply) {
        reply.content = body.content;
        await comment.save();
        return NextResponse.json({ message: 'success' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Failed' }, { status: 201 });
      }
    } else {
      return NextResponse.json({ message: 'Failed' }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}

// 답글 삭제, 댓글에서 comment삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get('id'); // reply _id
    const comment = await Comment.findOne({
      _id: params.id,
    });
    if (comment) {
      const reply = comment.replies.find((reply: any) => reply._id == id);
      if (reply) {
        comment.replies = comment.replies.filter(
          (reply: any) => reply._id != id
        );
        await comment.save();
        return NextResponse.json({ message: 'success' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Failed' }, { status: 201 });
      }
    } else {
      return NextResponse.json({ message: 'Failed' }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 201 });
  }
}
