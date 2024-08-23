'use client';

import React from 'react';
import style from '../../styles/common/header.module.scss';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={style['header-container']}>
      <img
        src="/images/png/logo.png"
        alt="logo"
        className={style['logo']}
        onClick={() => {
          router.push('/');
        }}
      />
      <div className={style['category-container']}>
        <span
          className={
            pathname === '/upload/lunch'
              ? `${style['category']} ${style['active']}`
              : style['category']
          }
          onClick={() => {
            router.push('/upload/lunch');
          }}
        >
          도시락올리기
        </span>
        <span
          className={
            pathname.includes('recipe')
              ? `${style['category']} ${style['active']}`
              : style['category']
          }
          onClick={() => {
            router.push('/recipe');
          }}
        >
          레시피
        </span>
      </div>
    </div>
  );
};

export default Header;
