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

    const data: UserType & { checked: boolean } = await req.json();
    const password: String = data.password;
    const checked: boolean = data.checked;
    console.log(data);
    const user: UserType = await User.findOne({ userId: data._id }).exec();
    if (user === null) {
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
    const response = NextResponse.json(body);
    if (checked) {
      const refresh = await jwt.sign(payload, process.env.REFRESH_SECRET!, {
        expiresIn: "365d",
      });
      response.cookies.set("refresh", refresh);
    }

    response.cookies.set("token", token);
    return response;
  } catch (error) {
    return Response.error();
  }
}
