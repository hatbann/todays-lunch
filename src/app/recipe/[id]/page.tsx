/** @format */
"use client";

import { RecipeType } from "@/model/recipe";
import React, { useEffect, useState } from "react";
import style from "../../../styles/pages/recipe/recipeDetail.module.scss";
import moment from "moment";
import { useRouter } from "next/navigation";

const page = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<undefined | RecipeType>(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const API_URL =
        process.env.NODE_ENV === "production"
          ? "/api"
          : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

      const res: RecipeType = await fetch(`${API_URL}/recipe/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .catch((e) => {
          console.log(e);
        });

      if (res) {
        const userData = await fetch(`${API_URL}/recipe/author/${res.author}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }).then((res) => res.json());

        const result: RecipeType = {
          title: res.title,
          description: res.description,
          author: userData.data.nickname,
          steps: res.steps,
          img: res.img,
          ingredients: res.ingredients,
          views: res.views,
          created_at: res.created_at,
        };
        console.log(result);
        setData(result);
      } else {
        setData(undefined);
      }

      setIsLoadingData(false);
    };

    getData();
  }, []);

  return isLoadingData ? (
    <div className={style["loading-container"]}>Loading...</div>
  ) : data ? (
    <div className={style["container"]}>
      <div className={style["info"]}>
        <div className={style["title"]}>{data.title}</div>
        <div className={style["additional-info"]}>
          <div className={style["left"]}>
            <span>작성자 | {data.author}</span>
            <span>{moment(data.created_at).format("YYYY-MM-DD")}</span>
          </div>
          <div className={style["right"]}>
            <span>조회수 {data.views}회</span>
          </div>
        </div>
      </div>
      <div className={style["desc-container"]}>
        <div className={style["index"]}>
          <span>설명</span>
          <img src="/images/png/desc.png" />
        </div>
        <div className={style["desc"]}>{data.description}</div>
      </div>
      <div className={style["ingredient-container"]}>
        <div className={style["index"]}>
          <span>재료</span>
          <img src="/images/png/ingredient.png" />
        </div>
        <div className={style["ingredients"]}>
          {data.ingredients.map((item, idx) => {
            return (
              <span
                className={
                  item.link
                    ? `${style["ingredient"]} ${style["link"]}`
                    : style["ingredient"]
                }
                onClick={() => {
                  if (item.link) {
                    window.open(item.link);
                  }
                }}>
                {item.name}
              </span>
            );
          })}
        </div>
      </div>
      <div className={style["step-container"]}>
        <div className={style["index"]}>
          <span>만드는 법</span>
          <img src="/images/png/recipe.png" />
        </div>
        <div className={style["steps"]}>
          {data.steps.map((item, idx) => {
            return (
              <div className={style["step"]}>
                <span>{idx + 1}단계</span>
                <p>{item.content}</p>
              </div>
            );
          })}
        </div>
      </div>
      {data.img && (
        <div className={style["img-container"]}>
          <h5 className={style["index"]}>완성 사진</h5>
          <div className={style["img"]}>
            <img src={data.img} alt="img" />
          </div>
        </div>
      )}
      <span
        onClick={() => {
          router.back();
        }}
        className={style["go-back"]}>
        목록
      </span>
    </div>
  ) : (
    <div className={style["error"]}>에러가 발생했습니다.</div>
  );
};

export default page;
