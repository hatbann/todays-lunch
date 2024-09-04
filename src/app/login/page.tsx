/** @format */

"use client";

import { useSinginForm } from "@/form/useLoginForm";
import React from "react";
import style from "../../styles/pages/login/style.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "@/states/user";
import { useRouter } from "next/navigation";

const page = () => {
  const {
    f: {
      setError,
      setValue,
      getValues,
      formState: { errors },
    },
    r,
  } = useSinginForm();
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const bodyData = {
        userId: getValues("userId"),
        password: getValues("password"),
      };

      const API_URL =
        process.env.NODE_ENV === "production"
          ? "/api"
          : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

      const res: { user: any; token: any } = await fetch(
        `${API_URL}/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      ).then((res) => {
        return res.json();
      });
      console.log(res.user._id);
      setUser({
        username: res.user.nickname,
        user_id: res.user._id,
        like: res.user.like,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style["container"]}>
      <h1>로그인</h1>
      <div className={style["form-section"]}>
        <form className={style["form-container"]}>
          <div className={style["form-item"]}>
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              {...r.userId}
              placeholder="아이디 입력"
            />
            {errors.userId && (
              <p className={style["error"]}>{errors.userId.message}</p>
            )}
          </div>
          <div className={style["form-item"]}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              {...r.password}
              placeholder="비밀번호 입력"
            />
            {errors.password && (
              <p className={style["error"]}>{errors.password.message}</p>
            )}
          </div>
        </form>
        <div className={style["btn-container"]}>
          <button type="button" onClick={handleSubmit}>
            로그인
          </button>
        </div>
      </div>
      <button
        className={style["join-btn"]}
        onClick={() => {
          router.push("/join");
        }}>
        회원가입
      </button>
    </div>
  );
};

export default page;
