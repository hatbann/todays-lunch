/** @format */

import mongoose, { InferSchemaType } from "mongoose";

const { Schema } = mongoose;

const StepSchema = new Schema({
  content: String,
});

const IngredientSchema = new Schema({
  name: String,
  link: {
    type: String,
    required: false,
  },
});

const RecipeSchema = new Schema({
  title: String,
  description: String,
  steps: [StepSchema],
  author: String,
  img: {
    type: String,
    required: false,
  },
  ingredients: [IngredientSchema],
  views: {
    type: Number,
    default: 0,
  },
});

RecipeSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

type RecipeType = InferSchemaType<typeof RecipeSchema> & {
  created_at: string;
  updated_at: string;
  _id: string;
};
type IngredientType = InferSchemaType<typeof IngredientSchema>;
type StepType = InferSchemaType<typeof StepSchema>;

export default mongoose.models.Recipes ||
  mongoose.model("Recipes", RecipeSchema);
export type { RecipeType, IngredientType, StepType };
