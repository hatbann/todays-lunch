/** @format */

import mongoose, { InferSchemaType } from "mongoose";
import { Infer } from "next/dist/compiled/superstruct";

const { Schema } = mongoose;
const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  nickname: String,
  like: [String],
});

type UserType = InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default mongoose.models.Users || mongoose.model("Users", UserSchema);
export type { UserType };
