/** @format */

import Recipe from "@/model/recipe";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const recipes = await Recipe.find().sort({ created_at: -1 });
    console.log(recipes);

    return new NextResponse(JSON.stringify(recipes), { status: 200 });
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
