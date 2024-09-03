/** @format */

import Lunch from "@/model/lunch";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const LUNCH_MAX = 20;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const skipNum = (page - 1) * LUNCH_MAX;
    const lunches = await Lunch.find()
      .sort({ created_at: -1 })
      .skip(skipNum)
      .limit(LUNCH_MAX);
    const total = await Lunch.countDocuments();

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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);
    const newLunch = new Lunch(body);

    await newLunch.save();

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
