/** @format */

import Lunch from "@/model/lunch";
import Recipe from "@/model/recipe";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const lunch = await Lunch.find({
      author: params.id,
    });
    const body = {
      message: "OK",
      lunch,
    };

    const response = NextResponse.json(body);

    return response;
  } catch (error) {
    return Response.error();
  }
}
