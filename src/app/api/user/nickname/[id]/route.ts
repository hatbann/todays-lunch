/** @format */

import User from "../../../../../model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    /*  */
    const ids = params.id.split(",");
    /*   const ids = req.nextUrl.searchParams.get('ids')?.split(','); */
    const authors = await User.find({
      _id: { $in: ids },
    });
    const userResult: { id: string; nickname: string }[] = [];
    authors.map((author) => {
      const tempId = author._id.toString();
      const tempNickname = author.nickname;
      userResult.push({
        id: tempId,
        nickname: tempNickname,
      });
    });
    return new NextResponse(
      JSON.stringify({
        message: "OK",
        data: userResult,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.error();
  }
}
