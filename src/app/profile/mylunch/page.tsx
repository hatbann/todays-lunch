/** @format */
"use client";

import React, { useEffect, useState } from "react";
import style from "../../../styles/pages/profile/mylunch.module.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { LunchType } from "@/model/lunch";
import moment from "moment";
import Lunch from "@/components/lunch/Lunch";
import { useRouter } from "next/navigation";

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(user.user_id);
    if (user.user_id !== "") {
      console.log("here");
      const fetchData = async () => {
        try {
          const API_URL =
            process.env.NODE_ENV === "production"
              ? "/api"
              : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

          const response = await fetch(
            `${API_URL}/profile/${user.user_id}/mylunch`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
            }
          )
            .then((res) => {
              return res.json();
            })
            .catch((e) => {
              console.log(e);
            });

          setLunchItems(response.lunch);
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
    <div className={style["loading-container"]}>Loading...</div>
  ) : (
    <div className={style["container"]}>
      {!isError && (
        <>
          <h2>내 도시락</h2>
          <section>
            {lunchItems.length !== 0 ? (
              <div className={style["lunch-items"]}>
                {lunchItems.map((item, idx) => {
                  return <Lunch item={item} />;
                })}
              </div>
            ) : (
              <div className={style["empty-container"]}>
                <h3>글이 없습니다</h3>
                <button
                  onClick={() => {
                    if (user.user_id === "") {
                      const result = confirm("로그인 후 이용해주세요");
                      if (result) {
                        router.push("/login");
                      }
                    } else {
                      router.push("/upload/lunch");
                    }
                  }}>
                  도시락 올리기
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default page;
