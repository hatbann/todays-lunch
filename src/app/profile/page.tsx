/** @format */
"use client";

import { LunchType } from "@/model/lunch";
import { RecipeType } from "@/model/recipe";
import { userState } from "@/states/user";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import style from "../../styles/pages/profile/style.module.scss";
import moment from "moment";
import { useRouter } from "next/navigation";

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchType[]>([]);
  const [recipeItems, setRecipeItems] = useState<RecipeType[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user.user_id !== "") {
      const fetchData = async () => {
        try {
          const API_URL =
            process.env.NODE_ENV === "production"
              ? "/api"
              : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

          const response = await fetch(`${API_URL}/profile/${user.user_id}`, {
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

          console.log(response);
          setLunchItems(response.lunch);
          setRecipeItems(response.recipe);
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
    <div className={style["loading"]}>Loading...</div>
  ) : (
    <div className={style["container"]}>
      {!isError && (
        <>
          <section className={style["user-profile-container"]}>
            <h3 className={style["title"]}>프로필</h3>
            <div className={style["profile-items"]}>
              <div className={style["profile-item"]}>
                <span>닉네임 | </span>
                <span>{user.username}</span>
              </div>
              <div className={style["btn-container"]}>
                {isEditMode ? (
                  <>
                    <button
                      className={style["cancel"]}
                      onClick={() => {
                        setIsEditMode(false);
                      }}>
                      취소
                    </button>
                    <button className={style["confirm"]}>완료</button>
                  </>
                ) : (
                  <button
                    className={style["edit"]}
                    onClick={() => {
                      setIsEditMode(true);
                    }}>
                    수정
                  </button>
                )}
              </div>
            </div>
          </section>
          <section className={style["user-lunchbox-container"]}>
            <h3 className={style["title"]}>최근 도시락</h3>
            {lunchItems.length !== 0 && (
              <p
                className={style["more"]}
                onClick={() => {
                  router.push("/profile/mylunch");
                }}>
                더보기
              </p>
            )}
            {lunchItems.length !== 0 ? (
              <div className={style["table"]}>
                <div className={style["head"]}>
                  <span style={{ width: "70%" }}>제목</span>
                  <span style={{ width: "20%" }}>작성일</span>
                  <span style={{ width: "10%" }}>좋아요 수</span>
                </div>
                <div className={style["body"]}>
                  {lunchItems.map((item, idx) => {
                    return (
                      <div className={style["body-item"]}>
                        <span style={{ width: "70%" }}>{item.title}</span>
                        <span style={{ width: "20%" }}>
                          {moment(item.created_at).format("YYYY-MM-DD")}
                        </span>
                        <span style={{ width: "10%", textAlign: "center" }}>
                          {item.like}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={style["empty-container"]}>
                <p>등록한 도시락이 없습니다</p>
                <a>도시락 올리기</a>
              </div>
            )}
          </section>
          <section className={style["user-recipe-container"]}>
            <h3 className={style["title"]}>최근 레시피</h3>
            {recipeItems.length !== 0 && (
              <p className={style["more"]}>더보기</p>
            )}
            {recipeItems.length !== 0 ? (
              <div className={style["table"]}>
                <div className={style["head"]}>
                  <span style={{ width: "70%" }}>제목</span>
                  <span style={{ width: "20%" }}>작성일</span>
                  <span style={{ width: "10%" }}>조회수</span>
                </div>
                <div className={style["body"]}>
                  {recipeItems.map((item, idx) => {
                    return (
                      <div className={style["body-item"]}>
                        <span
                          style={{ width: "70%", cursor: "pointer" }}
                          onClick={() => {
                            router.push(`/recipe/${item._id}`);
                          }}>
                          {item.title}
                        </span>
                        <span style={{ width: "20%" }}>
                          {/*              {moment(item.created_at).format("YYYY-MM-DD")} */}
                        </span>
                        <span style={{ width: "10%" }}>{item.views}회</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={style["empty-container"]}>
                <p>등록한 레시피가 없습니다</p>
                <a>레시피 올리기</a>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default page;
