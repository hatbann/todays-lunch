/** @format */

"use client";

import React, { useState } from "react";
import style from "../../../styles/pages/upload/lunch.module.scss";
import moment from "moment";
import Input, { InputImage, TextArea } from "@/components/upload/Input";
import { uploadImageToS3 } from "@/utils/uploadImageToS3";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";

const page = () => {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const user = useRecoilValue(userState);

  const isDisable =
    title.length < 1 ||
    content.length < 1 ||
    img === null ||
    user.user_id === "";

  const handleWrite = async () => {
    if (img) {
      try {
        const imgurl = await uploadImageToS3(img);
        const bodyData = {
          title,
          content,
          author: user.user_id,
          img: imgurl,
        };
        const API_URL =
          process.env.NODE_ENV === "production"
            ? "/api"
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/lunch`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(bodyData),
        })
          .then((res) => {
            return res.json();
          })
          .catch((e) => {
            console.log(e);
          });

        if (response.message === "success") {
          router.push("/upload/lunch/success");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={style["lunch-container"]}>
      <h2 className={style["head"]}>
        {moment().format("YYYY년 MM월 DD일")}의 도시락
      </h2>
      <section className={style["input-section"]}>
        <Input
          label={"제목"}
          value={title}
          htmlFor="title"
          onChange={(e) => {
            if (title.length < 50) {
              setTitle(e.target.value);
            }
          }}
          placeholder="제목을 입력하세요(50자 이내)"
        />
        <TextArea
          label={"설명"}
          value={content}
          htmlFor="content"
          onChange={(e) => {
            if (content.length < 500) {
              setContent(e.target.value);
            }
          }}
          placeholder="도시락을 자랑해주세요(500자 이내)"
        />
        <InputImage
          label={"도시락"}
          value={img}
          htmlFor="img"
          onChange={(e) => {
            if (e.target.files) {
              setImg(e.target.files[0]);
            }
          }}
          onDelete={() => {
            setImg(null);
          }}
        />
        <Input
          label={"작성자"}
          value={user.username}
          htmlFor="author"
          onChange={(e) => {}}
          placeholder=""
          disable={true}
        />
        <button
          className={style["write-btn"]}
          disabled={isDisable}
          onClick={handleWrite}>
          글쓰기
        </button>
      </section>
    </div>
  );
};

export default page;
