/** @format */

import { signIn } from "next-auth/react";
/** @format */

import { UserType } from "@/model/user";
import dbConnect from "@/utils/database";
import User from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data: UserType = await req.json();
    const password: String = data.password;
    const user: UserType = await User.findOne({ userId: data.userId }).exec();

    if (user == null) {
      return new NextResponse(
        JSON.stringify({ message: "NOTFOUND", result: "" })
      );
    }

    const isMatched: boolean = await bcrypt.compare(password, user.password);

    const payload = {
      // json web token 으로 변환할 데이터 정보
      user: {
        id: user._id,
      },
    };
    // json web token 생성하여 send 해주기
    const token = await jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const body = {
      message: isMatched ? "OK" : "WRONG",
      /*       token: {
        accessToken: isMatched && token,
      }, */
      user,
    };

    console.log(body);
    const response = NextResponse.json(body);

    // Set the token as an HTTP-only cookie
    // cookie 값 client 접근 불가능
    response.cookies.set("token", token);
    return response;
  } catch (error) {
    return Response.error();
  }
}
