/** @format */

import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    /*  */
    const author = await User.findOne({
      _id: params.id,
    });

    return new NextResponse(
      JSON.stringify({
        message: "OK",
        data: {
          id: author._id,
          nickname: author.nickname,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.error();
  }
}
