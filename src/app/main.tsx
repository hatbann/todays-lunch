/** @format */

"use client";

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { isLoginLoading, userState } from "@/states/user";
import style from "../styles/pages/main.module.scss";
import { useSetVh } from "@/hooks/useSetVh";
const Main = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useRecoilState(isLoginLoading);

  useEffect(() => {
    const getUserInfo = async () => {
      const API_URL =
        process.env.NODE_ENV === "production"
          ? "/api"
          : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

      const res: { message: any; token: any; user: any } = await fetch(
        `${API_URL}/token`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.log(e);
        });

      if (res.message === "OK") {
        setUser({
          username: res.user.nickname,
          user_id: String(res.user._id),
          like: res.user.like,
        });
      }
      setIsLoading(false);
    };

    getUserInfo();
  }, []);
  useSetVh();

  return <main className={style["main-container"]}>{children}</main>;
};

export default Main;
