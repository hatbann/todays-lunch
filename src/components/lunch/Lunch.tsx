/** @format */

import { LunchType } from "@/model/lunch";
import React, { useRef, useState } from "react";
import style from "../../styles/pages/lunch/lunch.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "@/states/user";
import { useRouter } from "next/navigation";
import { LunchItemType } from "@/types/global.type";
import { useClickOutside } from "@/hooks/useClickOutSide";
import Modal from "../common/Modal";
import { API } from "@/hooks/API";

type LunchProps = {
  item: LunchItemType;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (id: string, title: string, desc: string) => Promise<void>;
};

const Lunch = ({ item, handleDelete, handleEdit }: LunchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [lunchItem, setLunchItem] = useState<LunchItemType>(item);
  const router = useRouter();
  const isFill = user.like.find((likevalue) => likevalue === item._id);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [tempTitle, setTempTitle] = useState(lunchItem.title);
  const [tempDesc, setTempDesc] = useState(lunchItem.content);

  const handleLike = async () => {
    try {
      // lunchid가 pk, userid 가 body
      const response = await API.put<{ user: any; lunch: any }>(
        "/user/like",
        item._id,
        {
          userid: user.user_id,
        }
      );

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

  useClickOutside(ref, () => {
    setIsOpenModal(false);
  });

  return (
    <div className={style["lunch-container"]}>
      {isEditMode && (
        <div className={style["edit-btn-container"]}>
          <button
            className={style["cancel"]}
            onClick={() => {
              setIsEditMode(false);
            }}>
            취소
          </button>
          <button
            className={style["edit"]}
            onClick={() => {
              handleEdit(lunchItem._id, tempTitle, tempDesc);
              setIsEditMode(false);
            }}>
            수정
          </button>
        </div>
      )}
      {lunchItem.author === user.user_id && !isEditMode && (
        <div
          className={style["modal-btn"]}
          onClick={() => {
            setIsOpenModal((prev) => !prev);
          }}>
          <img src="/images/png/menu.png" />
        </div>
      )}
      {isOpenModal && (
        <div className={style["modal"]} ref={ref}>
          <div
            className={style["modal-item"]}
            onClick={() => {
              setIsOpenModal(false);
              setIsEditMode(true);
            }}>
            수정
          </div>
          <div
            className={style["modal-item"]}
            onClick={() => {
              setIsDeleteMode(true);
            }}>
            삭제
          </div>
        </div>
      )}
      <div className={style["title"]}>
        <label htmlFor="title">제목 : </label>
        <input
          id="title"
          className={isEditMode ? style["edit"] : ""}
          value={tempTitle}
          onChange={(e) => {
            setTempTitle(e.target.value);
          }}
          disabled={!isEditMode}
        />
      </div>
      <span className={style["author"]}>작성자 : {lunchItem.authorName}</span>
      {lunchItem.img && (
        <div className={style["img-wrapper"]}>
          <img src={lunchItem.img} alt="img" />
        </div>
      )}
      <div className={style["heart"]}>
        <span>좋아요 {lunchItem.like}</span>
        {isFill ? (
          <img
            src="/images/png/fillheart.png"
            alt="liked"
            onClick={() => {
              if (user.user_id !== "") {
                handleLike();
              } else {
                const result = confirm("로그인 후 이용해주세요");
                if (result) {
                  router.push("/login");
                }
              }
            }}
          />
        ) : (
          <img
            src="/images/png/emptyheart.png"
            alt="not liked"
            onClick={() => {
              if (user.user_id !== "") {
                handleLike();
              } else {
                const result = confirm("로그인 후 이용해주세요");
                if (result) {
                  router.push("/login");
                }
              }
            }}
          />
        )}
      </div>
      <div className={style["desc-container"]}>
        <div
          className={style["open-btn"]}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}>
          <span className={style["open-desc"]}>설명</span>
          <img
            src="/images/png/opendesc.png"
            className={
              isOpen
                ? `${style["arrow"]} ${style["open"]}`
                : `${style["arrow"]} ${style["close"]}`
            }
          />
        </div>
        {isOpen && (
          <textarea
            className={style["desc"]}
            value={tempDesc}
            onChange={(e) => {
              setTempDesc(e.target.value);
            }}
            disabled={!isEditMode}
          />
        )}
      </div>
      <Modal
        visiable={isDeleteMode}
        title="정말로 삭제하시겠습니까?"
        cancel="취소"
        cancelAction={() => {
          setIsDeleteMode(false);
        }}
        confirm="확인"
        confirmAction={() => {
          handleDelete(lunchItem._id);
          setIsDeleteMode(false);
        }}
      />
    </div>
  );
};

export default Lunch;
