'use client';

import React from 'react';
import style from '../../../styles/pages/join/style.module.scss';
import { useRouter } from 'next/navigation';

const Success = () => {
  const router = useRouter();

  return (
    <div className={style['success-container']}>
      <img src="/images/png/joinsucess.png" alt="success" />
      <h4>회원가입에 성공했습니다!</h4>
      <div className={style['btn-container']}>
        <button
          onClick={() => {
            router.push('/');
          }}
        >
          홈으로 가기
        </button>
        <button
          onClick={() => {
            router.push('/login');
          }}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Success;
