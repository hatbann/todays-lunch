/** @format */

import Lunch from "@/model/lunch";
import Recipe from "@/model/recipe";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
const secret = process.env.TOKEN_SECRET!;
const jwt = require("jsonwebtoken");
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value || "";
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      const lunch = await Lunch.find({
        author: userId,
      });
      const body = {
        message: "OK",
        lunch,
      };

      const response = NextResponse.json(body);

      return response;
    } else {
      const body = {
        message: "Failed",
        user: {},
      };
      const response = NextResponse.json(body);
      return response;
    }
  } catch (error) {
    return Response.error();
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
