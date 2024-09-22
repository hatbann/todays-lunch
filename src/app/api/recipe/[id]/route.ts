/** @format */

import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/model/recipe";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const recipe = await Recipe.findOne({
      _id: params.id,
    });

    recipe.views += 1;
    await recipe.save();
    return new NextResponse(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    return Response.error();
  }
}
