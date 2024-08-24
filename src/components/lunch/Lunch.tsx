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
        {isOpen && <div className={style['desc']}>{item.content}</div>}
      </div>
    </div>
  );
};

export default Lunch;
