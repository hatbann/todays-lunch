import { LunchType } from '@/model/lunch';
import React, { useState } from 'react';
import style from '../../styles/pages/lunch/lunch.module.scss';

const Lunch = ({ item }: { item: LunchType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={style['lunch-container']}>
      <span>제목 : {item.title}</span>
      <span>작성자 : {item.author}</span>
      {item.img && <img src={item.img} alt="img" />}
      <div className={style['desc-container']}>
        <span
          className={style['open-desc']}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          설명
        </span>
        {isOpen && <div className={style['desc']}>{item.content}</div>}
      </div>
    </div>
  );
};

export default Lunch;
