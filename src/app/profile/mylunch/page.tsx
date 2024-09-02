/** @format */
"use client";

import React, { useEffect, useState } from "react";
import style from "../../../styles/pages/profile/mylunch.module.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { LunchType } from "@/model/lunch";
import moment from "moment";

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user.user_id !== "") {
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
            <div className={style["table"]}>
              <div className={style["head"]}>
                <span style={{ width: "70%" }}>제목</span>
                <span style={{ width: "20%" }}>작성일</span>
                <span style={{ width: "10%" }}>조회수</span>
              </div>
              <div className={style["body"]}>
                {lunchItems.map((item, idx) => {
                  return (
                    <div className={style["body-item"]}>
                      <span style={{ width: "70%" }}>{item.title}</span>
                      <span style={{ width: "20%" }}>
                        {moment(item.created_at).format("YYYY-MM-DD")}
                      </span>
                      <span style={{ width: "10%" }}>{item.views}회</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default page;
