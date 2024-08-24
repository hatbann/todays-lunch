/** @format */

import dbConnect from '@/utils/database';
import { getDataFromToken } from '@/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/model/user';

const secret = process.env.TOKEN_SECRET!;
const jwt = require('jsonwebtoken');

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get('token')?.value || '';
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      console.log(decodedToken);
      const user = await User.findOne({ _id: userId });
      if (user) {
        const payload = {
          user: {
            nickname: user.nickname,
            userId: user.userId,
          },
        };
        const body = {
          message: 'OK',
          user,
        };

        const response = NextResponse.json(body);

        return response;
      } else {
        const body = {
          message: 'Failed',
        };
        const response = NextResponse.json(body);
        return response;
      }
    } else {
      const body = {
        message: 'Failed',
        user: {},
      };
      const response = NextResponse.json(body);
      return response;
    }
  } catch (error) {
    throw error;
  }
}
