/** @format */

import Lunch from "@/model/lunch";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    // lunchid가 pk, userId가 body
    const body = await req.json();
    const userid = body.userid;
    const lunchid = req.nextUrl.searchParams.get("id");
    const user = await User.findOne({
      _id: userid,
    });
    const lunch = await Lunch.findOne({
      _id: lunchid,
    });
    const isLiked = user.like.find(
      (likevalue: string) => likevalue === lunchid
    );

    // 좋아요 취소
    if (isLiked !== undefined) {
      const removed = user.like.filter(
        (likevalue: string) => likevalue !== lunchid
      );
      user.like = removed;
      lunch.like -= 1;
      await lunch.save();
      await user.save();
    } else {
      // 좋아요 추가
      lunch.like += 1;
      await lunch.save();
      user.like = [...user.like, lunchid];
      await user.save();
    }

    return new NextResponse(
      JSON.stringify({
        user,
        lunch,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.error();
  }
}
