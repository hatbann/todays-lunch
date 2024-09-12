/** @format */

import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

export const ReplySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const CommentSchema = new Schema({
  org: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  replies: [ReplySchema],
  content: {
    type: String,
    required: true,
  },
});

CommentSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

type CommentType = InferSchemaType<typeof CommentSchema> & {
  created_at: string;
  updated_at: string;
  _id: string;
  authorName: string;
};

export default mongoose.models.Comments ||
  mongoose.model("Comments", CommentSchema);

export type { CommentType };
