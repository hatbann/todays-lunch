/** @format */
export const dynamic = "force-dynamic";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.TOKEN_SECRET!;
const jwt = require("jsonwebtoken");

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value || "";
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      console.log(decodedToken);
      const user = await User.findOne({ _id: userId });
      if (user) {
        const payload = {
          // json web token 으로 변환할 데이터 정보
          user: {
            _id: user.id,
            nickname: user.nickname,
          },
        };
        const body = {
          message: "OK",
          user,
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
        message: "Token Expired",
        user: {},
      };
      const response = NextResponse.json(body);
      return response;
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        const body = {
          message: "Token Expired",
          user: {},
        };
        const response = NextResponse.json(body);
        return response;
      }
    }
  }
}
