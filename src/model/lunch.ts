/** @format */

import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

const LunchSchema = new Schema({
  title: String,
  content: String,
  img: String,
  views: Number,
});

LunchSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

type LunchType = InferSchemaType<typeof LunchSchema>;

export default mongoose.models.Lunchs || mongoose.model("Lunchs", LunchSchema);
export type { LunchType };
