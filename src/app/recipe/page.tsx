/** @format */

/* "use client"; */
"use server";

import { RecipeType } from "@/model/recipe";
import React from "react";
import RecipeView from "@/components/recipe/view";
import { revalidatePath } from "next/cache";
import { API } from "@/hooks/API";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const getInitialPageData = async ({ searchParams }: Props) => {
  const page = searchParams.page ?? "1";
  try {
    const response = await API.get<{ recipes: RecipeType[]; total: number }>(
      `/recipe`,
      {
        page: page,
      }
    );

    if (response) {
      const recipes = response.recipes;
      const totalCount = response.total;
      if (recipes) {
        const users = recipes.map((res: RecipeType) => {
          if (res.author) return res.author;
        });
        if (users.length !== 0) {
          const id = String(users);

          const userData = await API.get<{
            data: { id: string; nickname: string }[];
          }>(`/user/nickname/${id}`);

          const userArr: { id: string; nickname: string }[] = userData.data;
          const recipeRes: RecipeType[] = [];
          recipes.map((item: RecipeType) => {
            const name = userArr.find(
              (data) => data.id === item.author
            )?.nickname;
            const temp: RecipeType = {
              _id: item._id,
              title: item.title,
              description: item.description,
              img: item.img,
              views: item.views,
              steps: item.steps,
              ingredients: item.ingredients,
              author: name,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
            recipeRes.push(temp);
          });
          return {
            recipeRes,
            totalCount,
          };
        } else {
          return {
            recipeRes: [],
            totalCount: 0,
          };
        }
      } else {
        return {
          recipeRes: [],
          totalCount: 0,
        };
      }
    } else {
      return {
        recipeRes: [],
        totalCount: 0,
      };
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export default async function ({ searchParams }: Props) {
  async function revalidate() {
    "use server";
    revalidatePath("/recipe");
  }

  revalidate();
  const initialData = await getInitialPageData({ searchParams });

  return (
    <RecipeView
      recipes={initialData.recipeRes}
      totalCount={initialData.totalCount}
    />
  );
}
