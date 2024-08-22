/** @format */

import Sample from "@/model/sample";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const samples = await Sample.find().sort({ created_at: -1 });
    console.log(samples);

    return new NextResponse(JSON.stringify(samples), { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
