'use client';

import React from 'react';
import style from '../../styles/common/header.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <div className={style['header-container']}>
      <div className={style['right']}>
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
              pathname.includes('lunch')
                ? `${style['category']} ${style['active']}`
                : style['category']
            }
            onClick={() => {
              router.push('/lunch');
            }}
          >
            도시락
          </span>
          <span
            className={
              pathname.includes('recipe')
                ? `${style['category']} ${style['active']}`
                : style['category']
            }
            onClick={() => {
              console.log('dsaf');
              router.push('/recipe');
            }}
          >
            레시피
          </span>
        </div>
      </div>
      <div className={style['left']}>
        {user.user_id !== '' ? (
          <span>{user.username}</span>
        ) : (
          <span>로그인</span>
        )}
      </div>
    </div>
  );
};

export default Header;
