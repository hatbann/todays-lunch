/** @format */

import { RecipeType } from "@/model/recipe";
import React from "react";
import style from "../../styles/pages/recipe/recipeItem.module.scss";

const RecipeItem = ({ recipe }: { recipe: RecipeType }) => {
  return (
    <div className={style["item-container"]}>
      <span className={style["title"]}>{recipe.title}</span>
      <div className={style["author"]}>
        <span className={style["label"]}>작성자</span>
        <span className={style["value"]}>{recipe.author}</span>
      </div>
      <p className={style["desc"]}>{recipe.description}</p>
    </div>
  );
};

export default RecipeItem;
