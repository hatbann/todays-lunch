/** @format */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "../../styles/pages/lunch/style.module.scss";
import { LunchType } from "@/model/lunch";
import { useRouter } from "next/navigation";
import Lunch from "./Lunch";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";

const LunchView = ({
  lunch,
  totalCount,
}: {
  lunch: LunchType[];
  totalCount: number;
}) => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState(1);
  const [lunchItems, setLunchItems] = useState<LunchType[]>(lunch);
  const [isLoading, setIsLoading] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        try {
          const API_URL =
            process.env.NODE_ENV === "production"
              ? "/api"
              : `${process.env.NEXT_PUBLIC_API_URL!}/api`;
          const getMore = async () => {
            setIsLoading(true);

            const response = await fetch(`${API_URL}/lunch?page=${page + 1}`, {
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

            const lunches = response.lunches;
            if (lunches) {
              const users = lunches.map((res: LunchType) => {
                if (res.author) return res.author;
              });
              if (users.length !== 0) {
                const id = String(users);
                const userData = await fetch(`${API_URL}/user/nickname/${id}`, {
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
                const userArr: { id: string; nickname: string }[] =
                  userData.data;
                const lunchRes: LunchType[] = [];
                lunches.map((item: LunchType) => {
                  const name = userArr.find(
                    (data) => data.id === item.author
                  )?.nickname;
                  const temp: LunchType = {
                    _id: item._id,
                    title: item.title,
                    content: item.content,
                    img: item.img,
                    like: item.like,
                    author: name,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                  };
                  lunchRes.push(temp);
                });
                setLunchItems((prev) => [...prev, ...lunchRes]);
                setPage((prev) => prev + 1);
              }
            }
            setIsLoading(false);
          };

          if (totalCount > lunchItems.length) {
            getMore();
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
    },
    [lunchItems.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 1,
      root: null,
    });

    targetRef.current && observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [, targetRef.current]);

  return (
    <main className={style["main"]}>
      {lunch.length !== 0 ? (
        <section className={style["container"]}>
          <h2 className={style["title"]}>도시락통</h2>
          <p
            className={style["upload"]}
            onClick={() => {
              router.push("/upload/lunch");
            }}>
            도시락 올리기
          </p>
          {lunchItems.map((item, idx) => {
            return (
              <div
                key={`${idx}-${item.title}`}
                className={style["lunch-item"]}
                ref={lunchItems.length === idx + 1 ? targetRef : null}>
                <Lunch item={item} />
              </div>
            );
          })}
          {isLoading && <div className={style["loading"]}>Loading...</div>}
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
    </main>
  );
};

export default LunchView;
