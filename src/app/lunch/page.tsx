/** @format */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RecipeType } from "@/model/recipe";
import style from "../../styles/pages/lunch/style.module.scss";
import { LunchType } from "@/model/lunch";
import Lunch from "@/components/lunch/Lunch";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";

export default function Home() {
  const [lunch, setLunch] = useState<LunchType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useRecoilValue(userState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.NODE_ENV === "production"
            ? "/api"
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/lunch`, {
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

        if (response) {
          const users = response.map((res: LunchType) => {
            if (res.author) return res.author;
          });
          const id = String(users);
          const userData = await fetch(`${API_URL}/user/nickname/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          }).then((res) => res.json());
          const userArr: { id: string; nickname: string }[] = userData.data;
          const lunchRes: LunchType[] = [];
          response.map((item: LunchType) => {
            const name = userArr.find(
              (data) => data.id === item.author
            )?.nickname;
            const temp: LunchType = {
              title: item.title,
              content: item.content,
              img: item.img,
              views: item.views,
              author: name,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
            lunchRes.push(temp);
          });
          setLunch(lunchRes);
        }
        setIsLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <main className={style["main"]}>
      {isLoading ? (
        <p>Loading...</p>
      ) : lunch.length !== 0 ? (
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
}
