/** @format */

import Lunch, { LunchType } from "@/model/lunch";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const LUNCH_MAX = 2;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const userId = req.nextUrl.searchParams.get("userId");
    const skipNum = (page - 1) * LUNCH_MAX;
    let lunchRes: LunchType[] = [];
    let total = 0;
    if (userId) {
      lunchRes = await Lunch.find({ author: userId })
        .sort({ created_at: -1 })
        .skip(skipNum)
        .limit(LUNCH_MAX);
      total = await Lunch.countDocuments({
        author: userId,
      });
    } else {
      lunchRes = await Lunch.find()
        .sort({ created_at: -1 })
        .skip(skipNum)
        .limit(LUNCH_MAX);
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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newLunch = new Lunch(body);
    console.log(newLunch);

    await newLunch.save();
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get("id");
    const lunch = await Lunch.findOne({
      _id: id,
    });
    const data = await req.json();
    lunch.title = data.title;
    lunch.content = data.content;
    await lunch.save();
    return new NextResponse(
      JSON.stringify({
        message: "OK",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.error();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get("id");
    const res = await Lunch.deleteOne({
      _id: id,
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}
