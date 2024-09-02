/** @format */

import React from "react";
import style from "../../styles/common/header.module.scss";
import { useRouter } from "next/navigation";

type PopupTypes = {
  name: string;
  imgUrl: string;
  alt: string;
  routeUrl: string;
};

const PopupItems: PopupTypes[] = [
  {
    name: "프로필",
    imgUrl: "/images/png/profile.png",
    alt: "profile",
    routeUrl: "/profile",
  },
  {
    name: "내 도시락",
    imgUrl: "/images/png/lunchbox.png",
    alt: "lunchbox",
    routeUrl: "/profile/mylunch",
  },
  {
    name: "나만의 레시피",
    imgUrl: "/images/png/recipe.png",
    alt: "recipe",
    routeUrl: "/profile/myrecipe",
  },
];

const HeaderPopup = ({
  logout,
}: /*  ref, */
{
  logout: () => void;
  /*   ref: React.ForwardedRef<HTMLDivElement>; */
}) => {
  const router = useRouter();
  return (
    <div className={style["popup-container"]} /*  ref={ref} */>
      {PopupItems.map((item, idx) => {
        return (
          <div
            className={style["popup-item"]}
            onClick={() => {
              console.log("FAfads");
              router.push(item.routeUrl);
            }}>
            <img src={item.imgUrl} alt={item.alt} />
            <span>{item.name}</span>
          </div>
        );
      })}
      <div className={style["popup-item"]} onClick={logout}>
        <img src="/images/png/logout.png" />
        <span>로그아웃</span>
      </div>
    </div>
  );
};

export default HeaderPopup;
