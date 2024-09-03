/** @format */

import Lunch from "@/model/lunch";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const lunches = await Lunch.find().sort({ created_at: -1 });
    console.log(lunches);

    return new NextResponse(JSON.stringify(lunches), { status: 200 });
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
