/** @format */
"use server";

import { RecipeType } from "@/model/recipe";

import LunchView from "@/components/lunch/view";
import { revalidatePath } from "next/cache";
import { LunchType } from "@/model/lunch";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const getInitialPageData = async ({ searchParams }: Props) => {
  const page = searchParams.page ?? "1";
  try {
    const API_URL =
      process.env.NODE_ENV === "production"
        ? "/api"
        : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

    const response = await fetch(`${API_URL}/lunch?page=${page}`, {
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
    const totalCount = response.total;
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
        }).then((res) => res.json());
        const userArr: { id: string; nickname: string }[] = userData.data;
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
            views: item.views,
            author: name,
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

export default async function Home({ searchParams }: Props) {
  async function revalidate() {
    "use server";
    revalidatePath("/recipe");
  }

  revalidate();
  const initialData = await getInitialPageData({ searchParams });
  return (
    <LunchView
      lunch={initialData.lunchRes}
      totalCount={initialData.totalCount}
    />
  );
}
