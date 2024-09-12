/** @format */

import Comment, { ReplySchema } from "@/model/comment";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { InferSchemaType } from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const org_comment = await Comment.findOne({ org: params.id }).sort({
      created_at: -1,
    });
    if (org_comment) {
      const reply = mongoose.model("Replies", ReplySchema);
      const newReply = new reply({
        content: body.content,
        author: body.author,
      });
      await newReply.save();
      org_comment.replies.push(newReply);
      await org_comment.save();
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Failed" }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}

// comment 수정하는 것
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const id = req.nextUrl.searchParams.get("id"); // reply _id
    const comment = await Comment.findOne({
      _id: params.id,
    });
    if (comment) {
      const reply = comment.replies.find((reply: any) => reply._id == id);
      if (reply) {
        reply.content = body.content;
        await comment.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Failed" }, { status: 201 });
      }
    } else {
      return NextResponse.json({ message: "Failed" }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get("id"); // reply _id
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
        return NextResponse.json({ message: "success" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Failed" }, { status: 201 });
      }
    } else {
      return NextResponse.json({ message: "Failed" }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}
