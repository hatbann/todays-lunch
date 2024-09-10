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
import { LunchItemType } from "@/types/global.type";

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user.user_id !== "") {
      const fetchData = async () => {
        try {
          const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

          const response = await fetch(`${API_URL}/profile/mylunch`, {
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

          if (response.lunch && response.lunch.length !== 0) {
            const res: LunchType[] = [];

            response.lunch.map((item: LunchType) => {
              const temp = item;
              temp.author = user.username;
              res.push(temp);
            });
            setLunchItems(response.lunch);
          }

          setIsLoading(false);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user.user_id]);

  const handleEdit = () => {};

  const handleDelete = () => {};

  return isLoading ? (
    <div className={style["loading-container"]}>Loading...</div>
  ) : !isError ? (
    <div className={style["container"]}>
      <h2>내 도시락</h2>
      {lunchItems.length !== 0 ? (
        <section>
          <div className={style["lunch-items"]}>
            {lunchItems.map((item, idx) => {
              return (
                <Lunch
                  item={item}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            })}
          </div>
        </section>
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
    </div>
  ) : (
    <div className={style["error-container"]}>
      <h2>에러가 발생했습니다</h2>
      <p>잠시후 다시 시도해주세요</p>
    </div>
  );
};

export default page;
