'use client';

import React, { useEffect, useRef, useState } from 'react';
import style from '../../styles/common/reply.module.scss';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { ReplyType } from '@/model/comment';
import { useClickOutside } from '@/hooks/useClickOutSide';

const Reply = ({ reply }: { reply: ReplyType }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userState);

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
          <div className={style['btn']}>수정</div>
          <div className={style['btn']}>삭제</div>
        </div>
      )}
    </div>
  );
};

export default Reply;
