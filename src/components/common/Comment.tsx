import React, { useRef, useState } from 'react';
import style from '../../styles/common/comment.module.scss';
import { CommentType } from '@/model/comment';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { useClickOutside } from '@/hooks/useClickOutSide';
import Modal from './Modal';
import { CommentItemType } from '@/types/global.type';

const Comment = ({
  comment,
  writeReply,
  setReply,
  handleEdit,
  handleDelete,
}: {
  comment: CommentItemType;
  writeReply: (commentid: string) => void;
  setReply: React.Dispatch<React.SetStateAction<string>>;
  handleEdit: (commentid: string, content: string) => void;
  handleDelete: (commentid: string) => void;
}) => {
  const [isReplyMode, setIsReplyMode] = useState(false);
  const user = useRecoilValue(userState);
  const [isCommentOpenModal, setIsCommentOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState(comment.content);

  useClickOutside(ref, () => {
    setIsCommentOpenModal(false);
  });

  return (
    <div className={style['comment-wrapper']}>
      <div className={style['comment-author']}>{comment.authorName}</div>
      <div className={style['comment-content']}>
        <textarea
          disabled={!isEditMode}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className={style['content']}
        >
          {comment.content}
        </textarea>
        <button
          className={
            isEditMode
              ? `${style['reply-btn']} ${style['edit']}`
              : style['reply-btn']
          }
          onClick={() => {
            setIsReplyMode((prev) => !prev);
          }}
        >
          답글
        </button>
        <div
          className={
            !isEditMode
              ? `${style['edit-mode-btn-container']} ${style['disable']}`
              : style['edit-mode-btn-container']
          }
        >
          <button
            className={style['cancel']}
            onClick={() => {
              setIsEditMode(false);
            }}
          >
            취소
          </button>
          <button
            className={style['edit']}
            onClick={() => {
              handleEdit(comment._id, content);
              setIsEditMode(false);
            }}
          >
            수정
          </button>
        </div>
        {isReplyMode && (
          <div className={style['reply-container']}>
            <span className={style['comment-author']}>{user.username}</span>
            <textarea
              onChange={(e) => {
                setReply(e.target.value);
              }}
              placeholder="답글을 입력해주세요"
            />
            <div className={style['reply-write-btn-container']}>
              <button onClick={() => setIsReplyMode(false)}>취소</button>
              <button
                onClick={() => {
                  writeReply(comment._id);
                  setIsReplyMode(false);
                }}
              >
                입력
              </button>
            </div>
          </div>
        )}
      </div>
      {user.user_id === comment.author && (
        <div
          className={
            isEditMode
              ? `${style['modal-btn']} ${style['edit']}`
              : style['modal-btn']
          }
          onClick={() => {
            setIsCommentOpenModal((prev) => !prev);
          }}
        >
          <img src="/images/png/menu.png" />
        </div>
      )}
      {user.user_id === comment.author && isCommentOpenModal && (
        <div className={style['author-btn-container']} ref={ref}>
          <div
            className={style['btn']}
            onClick={() => {
              setIsEditMode(true);
              setIsCommentOpenModal(false);
            }}
          >
            수정
          </div>
          <div
            className={style['btn']}
            onClick={() => {
              setIsDeleteMode(true);
              setIsCommentOpenModal(false);
            }}
          >
            삭제
          </div>
        </div>
      )}
      <Modal
        visiable={isDeleteMode}
        title="댓글을 삭제하시겠습니까?"
        confirm="삭제"
        cancel="취소"
        confirmAction={() => {
          handleDelete(comment._id);
          setIsDeleteMode(false);
        }}
        cancelAction={() => {
          setIsDeleteMode(false);
        }}
      />
    </div>
  );
};

export default Comment;
