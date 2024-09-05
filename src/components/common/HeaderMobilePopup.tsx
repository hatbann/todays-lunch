/** @format */

import React from "react";
import style from "../../styles/common/headerMobilePopup.module.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { useRouter } from "next/navigation";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
};

type MenuType = {
  title: string;
  url: string;
};

const menus: MenuType[] = [
  {
    title: "도시락",
    url: "/lunch",
  },
  {
    title: "레시피",
    url: "/recipe",
  },
  {
    title: "내 도시락",
    url: "/profile/mylunch",
  },
  {
    title: "나만의 레시피",
    url: "/profile/myrecipe",
  },
];

const HeaderMobilePopup = ({ setIsOpen, handleLogout }: Props) => {
  const user = useRecoilValue(userState);
  const router = useRouter();

  return (
    <div className={style["container"]}>
      <div
        className={style["user-info"]}
        onClick={() => {
          if (user.user_id !== "") {
            router.push("/profile");
          } else {
            router.push("/login");
          }
          setIsOpen(false);
        }}>
        {user.user_id !== "" ? <h2>{user.username}</h2> : <h2>로그인</h2>}
        <img alt="go profile" src="/images/png/navarrow.png" />
      </div>
      <div className={style["line"]}></div>
      <section className={style["menus"]}>
        {menus.map((menu, idx) => {
          return (
            <div
              className={style["menu"]}
              onClick={() => {
                router.push(menu.url);
                setIsOpen(false);
              }}>
              <span>{menu.title}</span>
            </div>
          );
        })}
        {user.user_id !== "" ? (
          <button
            className={style["logout"]}
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}>
            로그아웃
          </button>
        ) : (
          <button
            className={style["login"]}
            onClick={() => {
              router.push("/login");
              setIsOpen(false);
            }}>
            로그인
          </button>
        )}
      </section>
    </div>
  );
};

export default HeaderMobilePopup;
