/** @format */
"use client";

import React, { useEffect, useState } from "react";
import style from "../../styles/pages/recipe/style.module.scss";
import RecipeItem from "./RecipeItem";
import { RecipeType } from "@/model/recipe";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import Pagenation from "../common/Pagenation";
import useDidMountEffect from "@/hooks/useDidMountEffect";

const RECIPE_MAX = 20;
const RECIPE_PAGE_MAX = 5;

const RecipeView = ({
  recipes,
  totalCount,
}: {
  recipes: RecipeType[];
  totalCount: number;
}) => {
  const query = useSearchParams();
  const temppage = query.get("page") ?? "1";
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState(Number(temppage));

  useDidMountEffect(() => {
    if (page !== Number(temppage)) {
      router.push(`/recipe?page=${page}`);
    }
  }, [page]);

  return (
    <div className={style["main"]}>
      {recipes.length !== 0 ? (
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
              <RecipeItem
                recipe={recipe}
                handleClick={() => {
                  if (user.user_id !== "") {
                    router.push(`/recipe/${recipe._id}`);
                  } else {
                    const result = confirm("로그인 후 이용해주세요");
                    if (result) {
                      router.push("/login");
                    }
                  }
                }}
              />
            ))}
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

export default RecipeView;
export { RECIPE_MAX, RECIPE_PAGE_MAX };
