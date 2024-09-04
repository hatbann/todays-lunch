/** @format */

import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

const LunchSchema = new Schema({
  /*   _id: String, */
  title: String,
  content: String,
  author: String,
  img: String,
  like: {
    type: Number,
    default: 0,
  },
});

LunchSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

type LunchType = InferSchemaType<typeof LunchSchema> & {
  created_at: string;
  updated_at: string;
  _id: string;
};
export default mongoose.models.Lunchs || mongoose.model("Lunchs", LunchSchema);
export type { LunchType };
