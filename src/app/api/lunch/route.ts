/** @format */

import Lunch from "@/model/lunch";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const LUNCH_MAX = 2;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const skipNum = (page - 1) * LUNCH_MAX;
    const lunches = await Lunch.find()
      .sort({ created_at: -1 })
      .skip(skipNum)
      .limit(LUNCH_MAX);
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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newLunch = new Lunch(body);
    console.log(newLunch);

    await newLunch.save();
    console.log("success");
    /*     return new NextResponse(
      JSON.stringify({
        message: "success",
      }),
      { status: 200 }
    ); */
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
