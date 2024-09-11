/** @format */

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "../../styles/pages/lunch/style.module.scss";
import { LunchType } from "@/model/lunch";
import { useRouter } from "next/navigation";
import Lunch from "./Lunch";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { LunchItemType } from "@/types/global.type";
import { API } from "@/hooks/API";
import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const LunchView = ({
  lunch,
  totalCount,
}: {
  lunch: LunchItemType[];
  totalCount: number;
}) => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState(1);
  const [lunchItems, setLunchItems] = useState<LunchItemType[]>(lunch);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(totalCount);
  const [isLoadAgain, setIsLoadAgain] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchData = async (page: number) => {
    try {
      const response = await API.get<{ lunches: LunchType[]; total: number }>(
        "/lunch",
        {
          page: page,
        }
      );
      const lunches = response.lunches;
      const totalCount = response.total;
      if (lunches) {
        const users = lunches.map((res: LunchType) => {
          if (res.author) return res.author;
        });
        if (users.length !== 0) {
          const id = String(users);
          const userData = await API.get<{
            data: { id: string; nickname: string }[];
          }>(`/user/nickname/${id}`);

          const userArr: { id: string; nickname: string }[] = userData.data;
          const lunchRes: LunchItemType[] = [];
          lunches.map((item: LunchType) => {
            const name = userArr.find(
              (data) => data.id === item.author
            )?.nickname;
            const temp: LunchItemType = {
              _id: item._id,
              title: item.title ?? "",
              content: item.content ?? "",
              img: item.img ?? "",
              like: item.like,
              author: item.author ?? "",
              authorName: name ?? "",
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
            lunchRes.push(temp);
          });
          return {
            lunchRes,
            totalCount,
          };
        } else {
          return {
            lunchRes: [],
            totalCount: 0,
          };
        }
      } else {
        return {
          lunchRes: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const loadMore = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    const newData = await fetchData(newPage);
    setLunchItems((prev) => [...prev, ...newData.lunchRes]);
    setPage(newPage);
    setIsLoading(false);
  };

  const handleEdit = async (id: string, title: string, desc: string) => {
    const body = {
      title,
      content: desc,
    };
    const response = await API.put<{ message: string }>(
      `/lunch/${id}`,
      JSON.stringify(body)
    );
    return { message: response.message };
  };

  const handleDelete = async (id: string) => {
    const response = await API.delete<{ message: string }>(`/lunch/${id}`);
    return { message: response.message };
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (target.isIntersecting) {
        if (lunchItems.length < total) loadMore();
      }
    },
    [page]
  );

  const handleRoute = () => {
    if (user.user_id !== "") {
      router.push("/upload/lunch");
    } else {
      router.push("/login");
    }
  };

  const loadAgain = async () => {
    try {
      const response = await API.get<{ lunches: LunchType[]; total: number }>(
        "/lunch/loadagain",
        {
          page: page,
        }
      );
      const lunches = response.lunches;
      const totalCount = response.total;
      if (lunches) {
        const users = lunches.map((res: LunchType) => {
          if (res.author) return res.author;
        });
        if (users.length !== 0) {
          const id = String(users);
          const userData = await API.get<{
            data: { id: string; nickname: string }[];
          }>(`/user/nickname/${id}`);
          const userArr: { id: string; nickname: string }[] = userData.data;
          const lunchRes: LunchItemType[] = [];
          lunches.map((item: LunchType) => {
            const name = userArr.find(
              (data) => data.id === item.author
            )?.nickname;
            const temp: LunchItemType = {
              _id: item._id,
              title: item.title ?? "",
              content: item.content ?? "",
              img: item.img ?? "",
              like: item.like,
              author: item.author ?? "",
              authorName: name ?? "",
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
            lunchRes.push(temp);
          });
          return {
            lunchRes,
            totalCount,
          };
        } else {
          return {
            lunchRes: [],
            totalCount: 0,
          };
        }
      } else {
        return {
          lunchRes: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "20px",
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observerRef.current?.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <main className={style["main"]}>
      {!isLoadAgain ? (
        lunch.length !== 0 ? (
          <section className={style["container"]}>
            <h2 className={style["title"]}>도시락통</h2>
            <div className={style["upload-button"]}>
              <button onClick={handleRoute}>도시락 올리기</button>
            </div>
            {lunchItems.map((item, idx) => {
              return (
                <div
                  key={`${idx}-${item.title}`}
                  className={style["lunch-item"]}
                  /*    ref={lunchItems.length === idx + 1 ? loadMoreRef : null} */
                >
                  <Lunch
                    item={item}
                    handleDelete={async (id) => {
                      const res = await handleDelete(id);
                      if (res.message === "OK") {
                        setIsLoadAgain(true);
                        const loadData = await loadAgain();
                        setLunchItems(loadData.lunchRes);
                        setTotal(loadData.totalCount);
                        setIsLoadAgain(false);
                      }
                    }}
                    handleEdit={async (id, title, desc) => {
                      const res = await handleEdit(id, title, desc);
                      if (res.message === "OK") {
                        setIsLoadAgain(true);
                        const loadData = await loadAgain();
                        setLunchItems(loadData.lunchRes);
                        setTotal(loadData.totalCount);
                        setIsLoadAgain(false);
                      }
                    }}
                  />
                </div>
              );
            })}
            <div
              ref={loadMoreRef}
              style={{ height: "20px", backgroundColor: "transparent" }}
            />
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
        )
      ) : (
        <div className={style["load-again-container"]}>Loading...</div>
      )}
    </main>
  );
};

export default LunchView;
