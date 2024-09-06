/** @format */

import Lunch from '@/model/lunch';
import Recipe from '@/model/recipe';
import User from '@/model/user';
import dbConnect from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

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
      const lunch = await Lunch.find({
        author: userId,
      }).limit(3);
      const recipe = await Recipe.find({
        author: userId,
      }).limit(3);

      if (user) {
        const payload = {
          user: {
            nickname: user.nickname,
            email: user.email,
          },
        };
        const body = {
          message: 'OK',
          user,
          lunch,
          recipe,
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
    return Response.error();
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const token = req.cookies.get('token')?.value || '';
    if (token) {
      const decodedToken: any = jwt.verify(token, secret);
      const userId = decodedToken.user.id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        const changeNickname = req.nextUrl.searchParams.get('nickname');
        user.nickname = changeNickname;
        await user.save();
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
    console.error('Error connecting to MongoDB:', error);
    return Response.error();
  }
}
