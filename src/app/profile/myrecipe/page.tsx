/** @format */
"use client";

import recipe, { RecipeType } from "@/model/recipe";
import { userState } from "@/states/user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import style from "../../../styles/pages/profile/myrecipe.module.scss";
import RecipeItem from "@/components/recipe/RecipeItem";
import Pagenation from "@/components/common/Pagenation";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const RECIPE_MAX = 20;
const RECIPE_PAGE_MAX = 5;

const myrecipe = () => {
  const user = useRecoilValue(userState);
  const [recipeItems, setRecipeItems] = useState<RecipeType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const query = useSearchParams();
  const temppage = query.get("page") ?? "1";
  const [page, setPage] = useState(Number(temppage));

  useEffect(() => {
    if (user.user_id !== "") {
      const fetchData = async () => {
        try {
          const API_URL =
            process.env.NODE_ENV === "production"
              ? "/api"
              : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

          const response = await fetch(
            `${API_URL}/profile/myrecipe?page=${temppage}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
            }
          )
            .then((res) => {
              return res.json();
            })
            .catch((e) => {
              console.log(e);
            });

          if (response.recipe && response.recipe.length !== 0) {
            const res: RecipeType[] = [];
            response.recipe.map((item: RecipeType) => {
              const temp = item;
              temp.author = user.username;
              res.push(temp);
            });
            setRecipeItems(res);
          }
          setTotalCount(response.total);

          setIsLoading(false);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user.user_id]);

  return isLoading ? (
    <div className={style["loading-container"]}>Loading...</div>
  ) : !isError ? (
    <div className={style["container"]}>
      <h2>나만의 레시피</h2>
      {recipeItems.length !== 0 ? (
        <>
          <div className={style["recipe-items"]}>
            {recipeItems.map((item, idx) => {
              return (
                <RecipeItem
                  recipe={item}
                  handleClick={() => {
                    router.push(`/recipe/${item._id}`);
                  }}
                />
              );
            })}
          </div>
          <div className={style["pagenation-container"]}>
            <Pagenation
              page={page}
              setPage={(value) => {
                if (value !== page) {
                  setPage(value);
                }
              }}
              total={totalCount}
              listLimit={RECIPE_MAX}
              pageLimit={RECIPE_PAGE_MAX}
            />
          </div>
        </>
      ) : (
        <div className={style["empty-container"]}>
          <h3>글이 없습니다</h3>
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
            레시피 작성하기
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className={style["error-container"]}>
      <h2>에러가 발생했습니다</h2>
      <p>잠시후 다시 시도해주세요</p>
    </div>
  );
};

export default myrecipe;
