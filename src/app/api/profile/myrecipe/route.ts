/** @format */

import Recipe from "@/model/recipe";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
const secret = process.env.TOKEN_SECRET!;
const jwt = require("jsonwebtoken");
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const RECIPE_MAX = 20;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const skipNum = (page - 1) * RECIPE_MAX;
    const token = req.cookies.get("token")?.value || "";
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      const recipe = await Recipe.find({
        author: userId,
      })
        .sort({ created_at: -1 })
        .skip(skipNum)
        .limit(RECIPE_MAX);

      const total = await Recipe.countDocuments({
        author: userId,
      });
      const body = {
        message: "OK",
        recipe,
        total,
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
