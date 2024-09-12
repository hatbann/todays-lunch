/** @format */
"use server";

import LunchView from "@/components/lunch/view";
import { revalidatePath } from "next/cache";
import { LunchType } from "@/model/lunch";
import { LunchItemType } from "@/types/global.type";
import { API } from "@/hooks/API";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const getInitialPageData = async () => {
  try {
    /*    const response = await API.get<{ lunches: LunchType[]; total: number }>(
      "/lunch",
      {
        page: 1,
      }
    ); */
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

    const response = await fetch(`${API_URL}/lunch?page=1`, {
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
    } else {
      return {
        lunchRes: [],
        totalCount: 0,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      lunchRes: [],
      totalCount: 0,
    };
    /*    return Promise.reject(error); */
  }
};

export default async function Home() {
  async function revalidate() {
    "use server";
    revalidatePath("/lunch");
  }

  revalidate();
  const initialData = await getInitialPageData();
  return (
    <LunchView
      lunch={initialData ? initialData.lunchRes : []}
      totalCount={initialData ? initialData.totalCount : 0}
    />
  );
}
