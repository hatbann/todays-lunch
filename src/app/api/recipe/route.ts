/** @format */

import Recipe, { RecipeType } from "@/model/recipe";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const RECIPE_MAX = 20;
    const page = Number(req.nextUrl.searchParams.get("page"));
    const userId = req.nextUrl.searchParams.get("userId");
    const skipNum = (page - 1) * RECIPE_MAX;
    let recipes: RecipeType[] = [];
    let total = 0;
    if (userId) {
      recipes = await Recipe.find({
        author: userId,
      })
        .sort({ created_at: -1 })
        .skip(skipNum)
        .limit(RECIPE_MAX);
      total = await Recipe.countDocuments({
        author: userId,
      });
    } else {
      recipes = await Recipe.find()
        .sort({ created_at: -1 })
        .skip(skipNum)
        .limit(RECIPE_MAX);
      total = await Recipe.countDocuments();
    }

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
    return NextResponse.json({ message: "Failed" }, { status: 201 });
  }
}
