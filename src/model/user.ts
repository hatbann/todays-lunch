/** @format */

import mongoose, { InferSchemaType } from 'mongoose';
import { Infer } from 'next/dist/compiled/superstruct';

const { Schema } = mongoose;
const UserSchema = new Schema({
  userId: String,
  password: String,
  nickname: String,
});

type UserType = Infer<typeof UserSchema>;

export default mongoose.models.Users || mongoose.model('Users', UserSchema);
export type { UserType };
