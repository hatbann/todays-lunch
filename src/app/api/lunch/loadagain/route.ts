/** @format */

import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import Lunch from "@/model/lunch";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const LUNCH_MAX = 2;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const lunches = await Lunch.find()
      .sort({ created_at: -1 })
      .limit(LUNCH_MAX * page);
    const total = await Lunch.countDocuments();

    /*    return NextResponse.json({ lunches, total }, { status: 200 }); */

    return new NextResponse(
      JSON.stringify({
        lunches,
        total,
      }),
      { status: 200 }
    );
  } catch (error) {
    return Response.error();
  }
}
