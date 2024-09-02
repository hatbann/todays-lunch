/** @format */

"use client";

import React, { createRef, useState } from "react";
import style from "../../styles/common/header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "@/states/user";
import { useClickOutside } from "@/hooks/useClickOutSide";
import HeaderPopup from "./HeaderPopup";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useRecoilValue(userState);
  const resetUser = useResetRecoilState(userState);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const userMenuRef = createRef<HTMLDivElement>();

  useClickOutside(userMenuRef, () => {
    setIsOpenPopup(false);
  });

  const logout = async () => {
    const API_URL =
      process.env.NODE_ENV === "production"
        ? "/api"
        : `${process.env.NEXT_PUBLIC_API_URL}/api`!;

    const res = await fetch(`${API_URL}/user/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    resetUser();
    setIsOpenPopup(false);
    router.replace("/");
  };

  return (
    <div className={style["header-container"]}>
      <div className={style["left"]}>
        <img
          src="/images/png/logo.png"
          alt="logo"
          className={style["logo"]}
          onClick={() => {
            router.push("/");
          }}
        />
        <div className={style["category-container"]}>
          <span
            className={
              pathname.includes("lunch") && !pathname.includes("profile")
                ? `${style["category"]} ${style["active"]}`
                : style["category"]
            }
            onClick={() => {
              router.push("/lunch");
            }}>
            도시락
          </span>
          <span
            className={
              pathname.includes("recipe")
                ? `${style["category"]} ${style["active"]}`
                : style["category"]
            }
            onClick={() => {
              console.log("dsaf");
              router.push("/recipe");
            }}>
            레시피
          </span>
        </div>
      </div>
      <div className={style["right"]} ref={userMenuRef}>
        {user.user_id !== "" ? (
          <span
            onClick={() => {
              setIsOpenPopup((prev) => !prev);
            }}>
            {user.username}
          </span>
        ) : (
          <span
            onClick={() => {
              router.push("/login");
            }}>
            로그인
          </span>
        )}
        {isOpenPopup && (
          <HeaderPopup logout={logout} /*  ref={userMenuRef} */ />
        )}
      </div>
    </div>
  );
};

export default Header;
