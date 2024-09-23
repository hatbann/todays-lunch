/** @format */
export const dynamic = "force-dynamic";
import User from "@/model/user";
import dbConnect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;
const jwt = require("jsonwebtoken");

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value || "";
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        const body = {
          message: "OK",
          user,
        };

        console.log("******* 1 *******");

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
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        const refresh = req.cookies.get("refresh")?.value || "";
        if (refresh) {
          const decodedRefresh: any = jwt.verify(refresh, refreshSecret);
          const userId = decodedRefresh.user.id;
          const user = await User.findOne({ _id: userId });
          if (user) {
            console.log("******* 3 *******");
            const payload = {
              // json web token 으로 변환할 데이터 정보
              user: {
                id: user._id,
              },
            };
            const token = await jwt.sign(payload, secret, {
              expiresIn: "1d",
            });

            const refresh = await jwt.sign(payload, refreshSecret, {
              expiresIn: "365d",
            });
            const body = {
              message: "OK",
              user,
            };
            const response = NextResponse.json(body);

            response.cookies.set("token", token);
            response.cookies.set("refresh", refresh);
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
      }
    }
  }
}
