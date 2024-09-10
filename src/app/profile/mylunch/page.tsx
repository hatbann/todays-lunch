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

const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
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
        const res: LunchItemType[] = [];

        response.lunch.map((item: LunchType) => {
          const temp: LunchItemType = {
            _id: item._id,
            title: item.title ?? "",
            content: item.content ?? "",
            img: item.img ?? "",
            like: item.like,
            created_at: item.created_at,
            updated_at: item.updated_at,
            authorName: user.username,
            author: item.author ?? "",
          };
          res.push(temp);
        });
        setLunchItems(res);
      }

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.user_id !== "") {
      fetchData();
    }
  }, [user.user_id]);

  const handleEdit = async (id: string, title: string, desc: string) => {
    const body = {
      title,
      content: desc,
    };
    const response = await fetch(`${API_URL}/profile/mylunch?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`${API_URL}/profile/mylunch?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  };

  console.log(lunchItems);

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
                <div className={style["wrapper"]}>
                  <Lunch
                    item={item}
                    handleDelete={async (id) => {
                      const res = await handleDelete(id);
                      if (res.message === "OK") {
                        setIsLoading(true);
                        const loadData = await fetchData();
                        setIsLoading(false);
                      }
                    }}
                    handleEdit={async (id, title, desc) => {
                      const res = await handleEdit(id, title, desc);
                      if (res.message === "OK") {
                        setIsLoading(true);
                        const loadData = await fetchData();
                        setIsLoading(false);
                      }
                    }}
                  />
                </div>
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
