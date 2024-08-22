/** @format */

import Sample from "@/model/sample";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);
    const newSample = new Sample(body);

    await newSample.save();

    return new NextResponse("post has been created", { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
