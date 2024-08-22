/** @format */

import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

const SampleSchema = new Schema({
  title: String,
  img: String,
});

SampleSchema.set("timestamps", {
  createdAt: "craeted_at",
});

type SampleType = InferSchemaType<typeof SampleSchema>;

export default mongoose.models.Samples ||
  mongoose.model("Samples", SampleSchema);
export type { SampleType };
