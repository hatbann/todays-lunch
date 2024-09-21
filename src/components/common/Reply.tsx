'use client';

import React, { useEffect, useRef, useState } from 'react';
import style from '../../styles/common/reply.module.scss';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { useClickOutside } from '@/hooks/useClickOutSide';
import Modal from './Modal';
import { ReplyType } from '@/model/Reply';

const Reply = ({
  reply,
  handleReplyDelete,
  handleReplyEdit,
}: {
  reply: ReplyType;
  handleReplyDelete: (replyid: string) => void;
  handleReplyEdit: (replyid: string, content: string) => void;
}) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userState);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useClickOutside(ref, () => {
    setIsReplyModalOpen(false);
  });

  return (
    <div className={style['reply']} key={String(reply._id)}>
      <div className={style['comment-author']}>{reply.authorName}</div>
      <div className={style['reply-content']}>{reply.content}</div>
      {user.user_id === reply.author && (
        <div
          className={style['modal-btn']}
          onClick={() => {
            setIsReplyModalOpen((prev) => !prev);
          }}
        >
          <img src="/images/png/menu.png" />
        </div>
      )}
      {user.user_id === reply.author && isReplyModalOpen && (
        <div className={style['author-btn-container']} ref={ref}>
          <div
            className={style['btn']}
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            수정
          </div>
          <div
            className={style['btn']}
            onClick={() => {
              setIsDeleteMode(true);
            }}
          >
            삭제
          </div>
        </div>
      )}
      <Modal
        visiable={isDeleteMode}
        title="답글을 삭제하시겠습니까?"
        confirm="삭제"
        cancel="취소"
        confirmAction={() => {
          handleReplyDelete(reply._id);
          setIsDeleteMode(false);
        }}
        cancelAction={() => {
          setIsDeleteMode(false);
        }}
      />
    </div>
  );
};

export default Reply;
