/** @format */

'use client';

import React, { createRef, useEffect, useState } from 'react';
import style from '../../styles/common/header.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { isLoginLoading, userState } from '@/states/user';
import { useClickOutside } from '@/hooks/useClickOutSide';
import HeaderPopup from './HeaderPopup';
import { scrollable } from '@/utils/scrollable';
import HeaderMobilePopup from './HeaderMobilePopup';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useRecoilValue(userState);
  const isLoading = useRecoilValue(isLoginLoading);
  const resetUser = useResetRecoilState(userState);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpenMobilePopup, setIsOpenMobilePopup] = useState(false);
  const userMenuRef = createRef<HTMLDivElement>();

  useClickOutside(userMenuRef, () => {
    setIsOpenPopup(false);
  });

  useEffect(() => {
    if (isOpenMobilePopup) {
      scrollable(false);
    } else {
      scrollable(true);
    }
  }, [isOpenMobilePopup]);

  const logout = async () => {
    const API_URL =
      process.env.NODE_ENV === 'production'
        ? '/api'
        : `${process.env.NEXT_PUBLIC_API_URL}/api`!;

    const res = await fetch(`${API_URL}/user/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    resetUser();
    setIsOpenPopup(false);
    router.replace('/');
  };

  return (
    <div className={style['header-container']}>
      <div className={style['left']}>
        <img
          src="/images/png/logo.png"
          alt="logo"
          className={style['logo']}
          onClick={() => {
            router.push('/');
            setIsOpenMobilePopup(false);
            setIsOpenPopup(false);
          }}
        />
        <div className={style['category-container']}>
          <span
            className={
              pathname.includes('lunch') && !pathname.includes('profile')
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
              pathname.includes('recipe') && !pathname.includes('profile')
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
      {!isLoading && (
        <div className={style['right']} ref={userMenuRef}>
          {user.user_id !== '' ? (
            <span
              onClick={() => {
                setIsOpenPopup((prev) => !prev);
              }}
            >
              {user.username}
            </span>
          ) : (
            <span
              onClick={() => {
                router.push('/login');
              }}
            >
              로그인
            </span>
          )}
          {isOpenPopup && (
            <HeaderPopup
              logout={logout}
              setIsOpenPopup={setIsOpenPopup} /*  ref={userMenuRef} */
            />
          )}
        </div>
      )}
      <div
        className={style['burger']}
        style={isOpenMobilePopup ? { display: 'none' } : {}}
        onClick={() => {
          setIsOpenMobilePopup(true);
        }}
      >
        <img src="/images/png/burger.png" alt="burger menu" />
      </div>
      <div
        className={style['close-mobile-popup']}
        style={!isOpenMobilePopup ? { display: 'none' } : {}}
        onClick={() => {
          setIsOpenMobilePopup(false);
        }}
      >
        <img src="/images/png/close.png" alt="close menu" />
      </div>
      {isOpenMobilePopup && (
        <HeaderMobilePopup
          setIsOpen={setIsOpenMobilePopup}
          handleLogout={logout}
        />
      )}
    </div>
  );
};

export default Header;
