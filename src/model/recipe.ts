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
});

RecipeSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

type RecipeType = InferSchemaType<typeof RecipeSchema>;

export default mongoose.models.Recipes ||
  mongoose.model("Recipes", RecipeSchema);
export type { RecipeType };
