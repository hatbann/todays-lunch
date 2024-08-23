/** @format */

'use client';

import { uploadImageToS3 } from '@/utils/uploadImageToS3';
import React, { ChangeEvent, useState } from 'react';

const page = () => {
  const [title, setTitle] = useState('');
  const [img, setImg] = useState<File | null>(null);

  const handleWrite = async () => {
    if (img) {
      try {
        const imgurl = await uploadImageToS3(img);
        const bodyData = {
          title,
          img: imgurl,
        };
        const API_URL =
          process.env.NODE_ENV === 'production'
            ? '/api'
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/imgsample`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(bodyData),
        })
          .then((res) => {
            res.json();
          })
          .catch((e) => {
            console.log(e);
          });

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeImg = async (e: ChangeEvent) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    if (targetFiles.length > 0) {
      const targetFilesArray = Array.from(targetFiles);
      const file = targetFilesArray[0];
      setImg(file);
    }
  };

  return (
    <div>
      <input
        type="text"
        name=""
        id=""
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input type="file" accept="image/*" onChange={handleChangeImg} />
      <button onClick={handleWrite}>글쓰기</button>
    </div>
  );
};

export default page;
