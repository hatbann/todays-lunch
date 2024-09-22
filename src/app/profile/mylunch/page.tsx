/** @format */
"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import style from "../../../styles/pages/profile/mylunch.module.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { LunchType } from "@/model/lunch";
import moment from "moment";
import Lunch from "@/components/lunch/Lunch";
import { useRouter } from "next/navigation";
import { LunchItemType } from "@/types/global.type";
import { API } from "@/hooks/API";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

const page = () => {
  const user = useRecoilValue(userState);
  const [lunchItems, setLunchItems] = useState<LunchItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchData = async (page: number) => {
    try {
      const response = await API.get<{ lunches: LunchType[]; total: number }>(
        "/lunch",
        {
          userId: user.user_id,
          page,
        }
      );

      const lunches = response.lunches;
      const totalCount = response.total;
      if (lunches) {
        const lunchRes: LunchItemType[] = [];

        lunches.map((item: LunchType) => {
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
    } catch (error) {
      setIsError(true);
      /*      setIsLoading(false); */
      return Promise.reject(error);
    }
  };

  const loadMore = async () => {
    setIsInfiniteLoading(true);
    const newPage = page + 1;
    const newData = await fetchData(newPage);
    setLunchItems((prev) => [...prev, ...newData.lunchRes]);
    setPage(newPage);
    setIsInfiniteLoading(false);
  };

  const handleEdit = async (id: string, title: string, desc: string) => {
    const body = {
      title,
      content: desc,
    };

    const response = await API.put<{ message: string }>(
      "/lunch",
      id,
      JSON.stringify(body)
    );
    return response;
  };

  const handleDelete = async (id: string) => {
    const response = await API.delete<{ message: string }>("/lunch", id);

    return response;
  };

  const loadAgain = async () => {
    try {
      const response = await API.get<{ lunches: LunchType[]; total: number }>(
        "/lunch/loadagain",
        {
          page: page,
          userId: user.user_id,
        }
      );
      const lunches = response.lunches;
      const totalCount = response.total;
      if (lunches && lunches.length !== 0) {
        const lunchRes: LunchItemType[] = [];

        lunches.map((item: LunchType) => {
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
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        console.log(lunchItems, total);
        if (lunchItems.length < total) loadMore();
      }
    },
    [page, isLoading]
  );

  useEffect(() => {
    if (user.user_id !== "") {
      const fetchInit = async () => {
        const res = await fetchData(1);
        setIsLoading(false);
        console.log(res);
        if (res) {
          setLunchItems(res.lunchRes);
          setTotal(res.totalCount);
        }
      };

      fetchInit();
    }
  }, [user.user_id]);

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
  }, [handleObserver, isLoading]);

  return (
    <main className={style["main"]}>
      {isLoading ? (
        <div className={style["loading-container"]}>Loading...</div>
      ) : !isError ? (
        <div className={style["container"]}>
          <h2 className={style["title"]}>내 도시락</h2>
          {lunchItems.length !== 0 ? (
            <>
              {lunchItems.map((item, idx) => {
                return (
                  <div className={style["wrapper"]} key={`${item._id}`}>
                    <Lunch
                      item={item}
                      handleDelete={async (id) => {
                        const res = await handleDelete(id);
                        if (res.message === "OK") {
                          setIsLoading(true);
                          const loadData = await loadAgain();
                          setLunchItems(loadData.lunchRes);
                          setTotal(loadData.totalCount);
                          setIsLoading(false);
                        }
                      }}
                      handleEdit={async (id, title, desc) => {
                        const res = await handleEdit(id, title, desc);
                        if (res.message === "OK") {
                          setIsLoading(true);
                          const loadData = await loadAgain();
                          setLunchItems(loadData.lunchRes);
                          setTotal(loadData.totalCount);
                          setIsLoading(false);
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
              {isInfiniteLoading && (
                <div className={style["loading"]}>Loading...</div>
              )}
            </>
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
      )}
    </main>
  );
};

export default page;
