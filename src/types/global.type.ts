/** @format */

import { ReplyType } from '@/model/Reply';

export type LunchItemType = {
  _id: string;
  title: string;
  content: string;
  img: string;
  like: number;
  author: string;
  authorName: string;
  created_at: string;
  updated_at: string;
};

export type CommentItemType = {
  _id: string;
  org: string;
  author: string;
  replies: ReplyType[];
  content: string;
  created_at: string;
  updated_at: string;
  authorName: string;
};
