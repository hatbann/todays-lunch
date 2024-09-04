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
