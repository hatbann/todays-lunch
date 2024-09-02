/** @format */

"use client";

import { RecipeType } from "@/model/recipe";
import React, { useEffect, useState } from "react";
import style from "../../styles/pages/recipe/style.module.scss";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import RecipeItem from "@/components/recipe/RecipeItem";

const page = () => {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.NODE_ENV === "production"
            ? "/api"
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/recipe`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .catch((e) => {
            console.log(e);
          });
        if (response) {
          const users = response.map((res: RecipeType) => {
            if (res.author) return res.author;
          });
          const id = String(users);
          const userData = await fetch(`${API_URL}/user/nickname/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          }).then((res) => res.json());
          const userArr: { id: string; nickname: string }[] = userData.data;
          const recipeRes: RecipeType[] = [];
          response.map((item: RecipeType) => {
            const name = userArr.find(
              (data) => data.id === item.author
            )?.nickname;
            const temp: RecipeType = {
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
          setRecipes(recipeRes);
        }
        setIsLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <div className={style["main"]}>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipes.length !== 0 ? (
        <section className={style["container"]}>
          <h2 className={style["title"]}>레시피</h2>
          <p
            className={style["upload"]}
            onClick={() => {
              router.push("/upload/recipe");
            }}>
            레시피 올리기
          </p>
          <div className={style["recipes-container"]}>
            {recipes.map((recipe, idx) => (
              <RecipeItem recipe={recipe} />
            ))}
          </div>
        </section>
      ) : (
        <div className={style["empty-container"]}>
          <h3>레시피가 없습니다</h3>

          <button
            onClick={() => {
              if (user.user_id === "") {
                const result = confirm("로그인 후 이용해주세요");
                if (result) {
                  router.push("/login");
                }
              } else {
                router.push("/upload/recipe");
              }
            }}>
            레시피 올리기
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
