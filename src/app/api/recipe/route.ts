/** @format */

import Recipe from "@/model/recipe";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const RECIPE_MAX = 20;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const skipNum = (page - 1) * RECIPE_MAX;
    const recipes = await Recipe.find()
      .sort({ created_at: -1 })
      .skip(skipNum)
      .limit(RECIPE_MAX);
    const total = await Recipe.countDocuments();

    console.log("passNum : ", page);

    return new NextResponse(
      JSON.stringify({
        recipes,
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
    console.log(body);
    const newRecipe = new Recipe(body);

    await newRecipe.save();
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
