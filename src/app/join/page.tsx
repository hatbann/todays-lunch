/** @format */

"use client";

import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import style from "../../styles/pages/join/style.module.scss";
import { useSignupForm } from "@/form/useSignupForm";
import { useRouter } from "next/navigation";
import { userState } from "@/states/user";
import { API } from "@/hooks/API";

export interface JoinFormValue {
  email: string;
  password: string;
  user_name: string;
}

const page = () => {
  const {
    f: {
      setError,
      setValue,
      getValues,
      formState: { errors },
    },
    r,
  } = useSignupForm();
  const router = useRouter();

  const handleSubmit = async () => {
    // TODO 형식확인해서 회원가입 막기
    try {
      const bodyData = {
        nickname: getValues("nickname"),
        userId: getValues("userId"),
        password: getValues("password"),
      };

      const res = await API.post<{ type: string; message: string }>(
        "/user/signup",
        JSON.stringify(bodyData)
      );

      if (res.type === "success") {
        router.push("/join/success");
      } else {
        alert("이미 가입한 계정입니다.");
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={style["container"]}>
      <h1>회원가입</h1>
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
          </div>
          {errors.userId && <p>{errors.userId.message}</p>}
          <div className={style["form-item"]}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              {...r.password}
              placeholder="비밀번호 입력"
            />
          </div>
          {errors.password && <p>{errors.password.message}</p>}
          <div className={style["form-item"]}>
            <label htmlFor="re_password">비밀번호 확인</label>
            <input
              type="password"
              id="re_password"
              {...r.re_password}
              placeholder="비밀번호 다시 입력"
            />
          </div>
          {errors.re_password && <p>{errors.re_password.message}</p>}
          <div className={style["form-item"]}>
            <label htmlFor="nickname">닉네임</label>
            <input type="text" id="nickname" {...r.nickname} />
          </div>
          {errors.nickname && <p>{errors.nickname.message}</p>}
        </form>
        <div className={style["btn-container"]}>
          <button
            type="button"
            onClick={handleSubmit}
            className={style["submit-btn"]}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
