import User from '@/model/user';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

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
          // json web token 으로 변환할 데이터 정보
          user: {
            _id: user.id,
            nickname: user.nickname,
          },
        };
        /*         const accessToken = await jwt.sign(payload, process.env.TOKEN_SECRET!, {
          expiresIn: '1d',
        });
        user.token = token;
        await user.save(); */
        const body = {
          message: 'OK',
          user,
        };

        const response = NextResponse.json(body);

        // Set the token as an HTTP-only cookie
        /*        response.cookies.set('token', accessToken, {
          httpOnly: true,
        });
 */
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
