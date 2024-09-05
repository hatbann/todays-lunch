/** @format */

"use client";

import React from "react";
import style from "../../../../styles/pages/upload/recipe.module.scss";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className={style["success-container"]}>
      <img src="/images/png/success.png" alt="success" />

      <h3>업로드를 성공했습니다!</h3>
      <div className={style["btn-container"]}>
        <button
          onClick={() => {
            router.push("/recipe");
          }}>
          레시피 보러가기
        </button>
        <button
          onClick={() => {
            router.push("/profile/myrecipe");
          }}>
          나만의 레시피
        </button>
      </div>
    </div>
  );
};

export default page;
