/** @format */
"use client";

import { LunchType } from "@/model/lunch";
import { RecipeType } from "@/model/recipe";
import { userState } from "@/states/user";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import style from "../../styles/pages/profile/style.module.scss";
import moment from "moment";
import { useRouter } from "next/navigation";
import { API } from "@/hooks/API";
import { UserType } from "@/model/user";

const page = () => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const [lunchItems, setLunchItems] = useState<LunchType[]>([]);
  const [recipeItems, setRecipeItems] = useState<RecipeType[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (user.user_id !== "") {
      const fetchData = async () => {
        try {
          const response = await API.get<{
            message: string;
            user: UserType | null;
            lunch: LunchType[];
            recipe: RecipeType[];
          }>("/profile");

          setLunchItems(response.lunch);
          setRecipeItems(response.recipe);
          setIsLoading(false);
          if (response.message === "Failed") {
            alert("다시 로그인해주세요");
            resetUser();
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/login");
          }
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      };

      fetchData();
      setNickname(user.username);
    }
  }, [user.user_id]);

  const handleChangeNickname = async () => {
    try {
      setIsLoading(true);

      const response = await API.put<{ message: string; user: any }>(
        "/profile",
        user.user_id,
        {
          nickname: nickname,
        }
      );

      if (response.message === "OK") {
        setUser({
          user_id: response.user._id,
          username: response.user.nickname,
          like: response.user.like,
        });
      } else if (response.message === "Failed") {
        alert("실패했습니다. 다시 로그인해주세요");
        resetUser();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

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
                <input
                  type="text"
                  /*             placeholder={user.username} */
                  disabled={!isEditMode}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                />
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
                    <button
                      className={style["confirm"]}
                      onClick={() => {
                        handleChangeNickname();
                        setIsEditMode(false);
                      }}>
                      완료
                    </button>
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
                  <span>제목</span>
                  <span>작성일</span>
                  <span>좋아요</span>
                </div>
                <div className={style["body"]}>
                  {lunchItems.map((item, idx) => {
                    return (
                      <div className={style["body-item"]}>
                        <span>{item.title}</span>
                        <span>
                          {moment(item.created_at).format("YYYY-MM-DD")}
                        </span>
                        <span style={{ textAlign: "center" }}>{item.like}</span>
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
                  <span>제목</span>
                  <span>작성일</span>
                  <span>조회수</span>
                </div>
                <div className={style["body"]}>
                  {recipeItems.map((item, idx) => {
                    return (
                      <div className={style["body-item"]}>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            router.push(`/recipe/${item._id}`);
                          }}>
                          {item.title}
                        </span>
                        <span>
                          {/*              {moment(item.created_at).format("YYYY-MM-DD")} */}
                        </span>
                        <span>{item.views}회</span>
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
