/** @format */

"use client";

import React, { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { isLoginLoading, userState } from "@/states/user";
import style from "../styles/pages/main.module.scss";
import { useSetVh } from "@/hooks/useSetVh";
import { useRouter } from "next/navigation";
import { API } from "@/hooks/API";
const Main = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const [isLoading, setIsLoading] = useRecoilState(isLoginLoading);
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await API.get<{ message: any; user: any }>(`/token`);

      if (res.message === "OK") {
        setUser({
          username: res.user.nickname,
          user_id: String(res.user._id),
          like: res.user.like,
        });
      } else if (res.message === "Token Expired") {
        resetUser();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        const confirmed = confirm("다시 로그인해주세요");

        if (confirmed) {
          router.push("/login");
        }
      } else {
        alert("서버에러가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
      setIsLoading(false);
    };

    getUserInfo();
  }, []);
  useSetVh();

  return <main className={style["main-container"]}>{children}</main>;
};

export default Main;
