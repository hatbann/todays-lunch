/** @format */

import { ObjectId } from "mongodb";

export type userType = {
  user_id: string; // _id
  username: string;
  like: string[];
};
