/** @format */

"use client";

import React from "react";
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
          {lunch.map((item, idx) => {
            return (
              <div key={`${idx}-${item.title}`} className={style["lunch-item"]}>
                <Lunch item={item} />
              </div>
            );
          })}
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
