/** @format */

import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import Lunch, { LunchType } from "@/model/lunch";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const LUNCH_MAX = 2;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const userId = req.nextUrl.searchParams.get("userId");
    let lunchRes: LunchType[] = [];
    let total = 0;
    if (userId) {
      lunchRes = await Lunch.find({
        author: userId,
      })
        .sort({ created_at: -1 })
        .limit(LUNCH_MAX * page);
      total = await Lunch.countDocuments({
        author: userId,
      });
    } else {
      lunchRes = await Lunch.find()
        .sort({ created_at: -1 })
        .limit(LUNCH_MAX * page);
      total = await Lunch.countDocuments();
    }

    /*    return NextResponse.json({ lunches, total }, { status: 200 }); */

    return new NextResponse(
      JSON.stringify({
        lunches: lunchRes,
        total,
      }),
      { status: 200 }
    );
  } catch (error) {
    return Response.error();
  }
}
