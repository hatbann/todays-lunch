/** @format */

import { LunchType } from '@/model/lunch';
import React, { useState } from 'react';
import style from '../../styles/pages/lunch/lunch.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { useRouter } from 'next/navigation';

const Lunch = ({ item }: { item: LunchType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [lunchItem, setLunchItem] = useState<LunchType>(item);
  const router = useRouter();
  const isFill = user.like.find((likevalue) => likevalue === item._id);

  const handleLike = async () => {
    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

      const response = await fetch(
        `${API_URL}/user/like?userid=${user.user_id}&lunchid=${item._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        }
      )
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(response.user);
      setUser({
        user_id: response.user._id,
        username: response.user.nickname,
        like: response.user.like,
      });
      setLunchItem({
        ...lunchItem,
        like: response.lunch.like,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <div className={style['lunch-container']}>
      <span className={style['title']}>제목 : {lunchItem.title}</span>
      <span className={style['author']}>작성자 : {lunchItem.author}</span>
      {lunchItem.img && (
        <div className={style['img-wrapper']}>
          <img src={lunchItem.img} alt="img" />
        </div>
      )}
      <div className={style['heart']}>
        <span>좋아요 {lunchItem.like}</span>
        {isFill ? (
          <img
            src="/images/png/fillheart.png"
            alt="liked"
            onClick={() => {
              if (user.user_id !== '') {
                handleLike();
              } else {
                const result = confirm('로그인 후 이용해주세요');
                if (result) {
                  router.push('/login');
                }
              }
            }}
          />
        ) : (
          <img
            src="/images/png/emptyheart.png"
            alt="not liked"
            onClick={() => {
              if (user.user_id !== '') {
                handleLike();
              } else {
                const result = confirm('로그인 후 이용해주세요');
                if (result) {
                  router.push('/login');
                }
              }
            }}
          />
        )}
      </div>
      <div className={style['desc-container']}>
        <div
          className={style['open-btn']}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <span className={style['open-desc']}>설명</span>
          <img
            src="/images/png/opendesc.png"
            className={
              isOpen
                ? `${style['arrow']} ${style['open']}`
                : `${style['arrow']} ${style['close']}`
            }
          />
        </div>
        {isOpen && <div className={style['desc']}>{lunchItem.content}</div>}
      </div>
    </div>
  );
};

export default Lunch;
