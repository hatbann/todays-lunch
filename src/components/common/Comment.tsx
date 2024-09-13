import React, { useRef, useState } from 'react';
import style from '../../styles/common/comment.module.scss';
import { CommentType } from '@/model/comment';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { useClickOutside } from '@/hooks/useClickOutSide';

const Comment = ({
  comment,
  writeReply,
  setReply,
}: {
  comment: CommentType;
  writeReply: (commentid: string) => void;
  setReply: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isReplyMode, setIsReplyMode] = useState(false);
  const user = useRecoilValue(userState);
  const [isCommentOpenModal, setIsCommentOpenModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setIsCommentOpenModal(false);
  });

  return (
    <div className={style['comment-wrapper']}>
      <div className={style['comment-author']}>{comment.authorName}</div>
      <div className={style['comment-content']}>
        <div className={style['content']}>{comment.content}</div>
        <button
          className={style['reply-btn']}
          onClick={() => {
            setIsReplyMode((prev) => !prev);
          }}
        >
          답글
        </button>
        {isReplyMode && (
          <div className={style['reply-container']}>
            <span className={style['comment-author']}>{user.username}</span>
            <textarea
              onChange={(e) => {
                setReply(e.target.value);
              }}
              placeholder="답글을 입력해주세요"
            />
            <button
              onClick={() => {
                writeReply(comment._id);
              }}
            >
              입력
            </button>
          </div>
        )}
      </div>
      {user.user_id === comment.author && (
        <div
          className={style['modal-btn']}
          onClick={() => {
            setIsCommentOpenModal((prev) => !prev);
          }}
        >
          <img src="/images/png/menu.png" />
        </div>
      )}
      {user.user_id === comment.author && isCommentOpenModal && (
        <div className={style['author-btn-container']} ref={ref}>
          <div className={style['btn']}>수정</div>
          <div className={style['btn']}>삭제</div>
        </div>
      )}
    </div>
  );
};

export default Comment;
