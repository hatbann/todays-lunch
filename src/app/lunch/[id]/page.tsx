/** @format */

"use client";

import { LunchItemType } from "@/types/global.type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import style from "../../../styles/pages/lunch/lunchDetail.module.scss";
import { CommentType } from "@/model/comment";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { API } from "@/hooks/API";
import { UserType } from "@/model/user";

const page = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<undefined | LunchItemType>(undefined);
  const user = useRecoilValue(userState);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get<{ lunch: LunchItemType }>(
          `/lunch/${params.id}`
        );
        const lunch = response.lunch;
        if (lunch) {
          const userData = (
            await API.retrieve<{ data: UserType }>(`/author/`, lunch.author)
          ).data;

          const result: LunchItemType = {
            _id: lunch._id,
            title: lunch.title,
            content: lunch.content,
            img: lunch.img,
            like: lunch.like,
            author: lunch.author,
            authorName: userData.nickname ?? "",
            created_at: lunch.created_at,
            updated_at: lunch.updated_at,
          };

          setData(result);
        } else {
          setData(undefined);
        }
      } catch (error) {
        setData(undefined);
      }
    };

    fetchData();
    setIsLoadingData(false);
  }, []);

  return isLoadingData ? (
    <div className={style["loading-container"]}>Loading...</div>
  ) : data ? (
    <div className={style["container"]}>
      <div className={style["info"]}>
        <div className={style["title"]}>제목 : {data.title}</div>
        <div className={style["additional-info"]}>
          <div>작성자 | {data.author}</div>
          <div>좋아요 | {data.like}</div>
        </div>
      </div>
      {data.img && (
        <div className={style["img"]}>
          <img src={data.img} alt="img" />
        </div>
      )}
      <div className={style["content"]}>{data.content}</div>
      <div className={style["comment-container"]}>
        <h3>Comment</h3>
        <div className={style["comment-items"]}>
          {comments.map((comment) => (
            <div className={style["comment-item"]}>
              <div className={style["comment-author"]}>
                {comment.authorName}
              </div>
              <div className={style["comment-content"]}>{comment.content}</div>
              {user.user_id === comment.author && (
                <div className={style["author-btn-container"]}>
                  <button>수정</button>
                  <button>삭제</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={style["input"]}>
          <textarea
            placeholder="댓글을 입력해주세요"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button>입력</button>
        </div>
      </div>
    </div>
  ) : (
    <div className={style["error"]}>에러가 발생했습니다.</div>
  );
};

export default page;
