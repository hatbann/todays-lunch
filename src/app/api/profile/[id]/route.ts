/** @format */

import Lunch from "@/model/lunch";
import Recipe from "@/model/recipe";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

const secret = process.env.TOKEN_SECRET!;
const jwt = require("jsonwebtoken");

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const lunch = await Lunch.find({
      author: params.id,
    }).limit(3);
    const recipe = await Recipe.find({
      author: params.id,
    }).limit(3);
    const token = req.cookies.get("token")?.value || "";
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      console.log(decodedToken);
      const user = await User.findOne({ _id: userId });
      if (user) {
        const payload = {
          user: {
            nickname: user.nickname,
            email: user.email,
          },
        };
        const body = {
          message: "OK",
          user,
          lunch,
          recipe,
        };

        const response = NextResponse.json(body);

        return response;
      } else {
        const body = {
          message: "Failed",
        };
        const response = NextResponse.json(body);
        return response;
      }
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
