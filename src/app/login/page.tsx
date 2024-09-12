/** @format */

"use client";

import { useSinginForm } from "@/form/useLoginForm";
import React from "react";
import style from "../../styles/pages/login/style.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "@/states/user";
import { useRouter } from "next/navigation";
import { API } from "@/hooks/API";

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
        _id: getValues("userId"),
        password: getValues("password"),
      };

      const res = await API.post<{ user: any; token: any; message: any }>(
        "/user/signin",
        JSON.stringify(bodyData)
      );

      if (res.message === "OK") {
        setUser({
          username: res.user.nickname,
          user_id: res.user._id,
          like: res.user.like,
        });
        router.push("/");
      } else if (res.message === "NOTFOUND") {
        const confirmed = confirm(
          "계정이 존재하지 않습니다. 회원가입을 해주세요."
        );
        if (confirmed) {
          router.push("/join");
        }
      } else if (res.message === "WRONG") {
        alert("비밀번호 및 아이디를 다시 확인해주세요");
      }
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
