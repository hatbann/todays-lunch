/** @format */

'use client';

import { LunchItemType } from '@/types/global.type';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import style from '../../../styles/pages/lunch/lunchDetail.module.scss';
import { CommentType, ReplyType } from '@/model/comment';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { API } from '@/hooks/API';
import { UserType } from '@/model/user';
import { useClickOutside } from '@/hooks/useClickOutSide';
import Reply from '@/components/common/Reply';
import Comment from '@/components/common/Comment';
import Modal from '@/components/common/Modal';

const page = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<undefined | LunchItemType>(undefined);
  const user = useRecoilValue(userState);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [reply, setReply] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();
  const [comment, setComment] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const response = await API.get<{ lunch: LunchItemType }>(
        `/lunch/${params.id}`
      );
      const lunch = response.lunch;
      if (lunch) {
        const userData = (
          await API.retrieve<{ data: UserType }>(`/author/`, lunch.author)
        ).data;

        const result: LunchItemType = {
          _id: lunch._id,
          title: lunch.title,
          content: lunch.content,
          img: lunch.img,
          like: lunch.like,
          author: lunch.author,
          authorName: userData.nickname ?? '',
          created_at: lunch.created_at,
          updated_at: lunch.updated_at,
        };

        setData(result);
      } else {
        setData(undefined);
      }

      const commentResponse = await API.get<{
        comments: CommentType[];
        message: string;
      }>('/comment', {
        org: params.id,
      });

      const comments = commentResponse.comments;
      if (comments.length !== 0 && commentResponse.message === 'success') {
        const commentUsers = Array.from(
          new Set(comments.map((comment) => comment.author))
        );
        const userData = await API.get<{
          data: { id: string; nickname: string }[];
        }>(`/user/nickname/${commentUsers.join(',')}`);
        const userArr: { id: string; nickname: string }[] = userData.data;

        const commentsRes: CommentType[] = [];

        comments.map((comment) => {
          const name = userArr.find(
            (data) => data.id === comment.author
          )?.nickname;
          const temp: CommentType = {
            _id: comment._id,
            org: comment.org,
            author: comment.author,
            authorName: name ?? '',
            replies: comment.replies,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
          };
          commentsRes.push(temp);
        });
        setComments(commentsRes);
      }

      console.log(commentResponse);
    } catch (error) {
      setData(undefined);
    }
    setIsLoadingData(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const writeComment = async () => {
    try {
      const body = {
        author: user.user_id,
        org: params.id,
        content: comment,
      };

      const response = await API.post<{
        message: string;
      }>('/comment', JSON.stringify(body));

      if (response.message === 'success') {
        console.log('refresh!');
        fetchData();
      } else {
        alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
      }
    } catch (error) {
      alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
    }
  };

  const writeReply = async (org_comment: string) => {
    try {
      const body = {
        content: reply,
        author: user.user_id,
        authorName: user.username,
      };

      const response = await API.post<{
        message: string;
      }>(`/comment/${org_comment}`, JSON.stringify(body));

      if (response.message === 'success') {
        fetchData();
      } else {
        alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
      }
    } catch (error) {
      alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
    }
  };

  const handleCommentDelete = async (id: string) => {
    try {
      const response = await API.delete<{ message: string }>('/comment', id);

      if (response.message === 'success') {
        fetchData();
      } else {
        alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
      }
    } catch (error) {
      alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
    }
  };

  const handleCommentEdit = async (id: string, content: string) => {
    try {
      const body = {
        content: content,
      };

      const response = await API.put<{ message: string }>(
        '/comment',
        id,
        JSON.stringify(body)
      );
      if (response.message === 'success') {
        fetchData();
      } else {
        alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
      }
    } catch (error) {
      alert('에러가 발생했습니다. 잠시후 다시 시도해주세요');
    }
  };

  return isLoadingData ? (
    <div className={style['loading-container']}>Loading...</div>
  ) : data ? (
    <div className={style['container']}>
      <div className={style['info']}>
        <div className={style['title']}>제목 : {data.title}</div>
        <div className={style['additional-info']}>
          <div>작성자 | {data.authorName}</div>
          <div>좋아요 | {data.like}</div>
        </div>
      </div>
      <div className={style['contents']}>
        <div className={style['desc']}>{data.content}</div>
        {data.img && (
          <div className={style['img']}>
            <img src={data.img} alt="img" />
          </div>
        )}
      </div>
      <div className={style['comment-container']}>
        <h3 className={style['title']}>Comment</h3>
        <div className={style['comment-items']}>
          {comments.length !== 0 ? (
            comments.map((comment) => (
              <div className={style['comment-item']}>
                <Comment
                  comment={comment}
                  writeReply={writeReply}
                  setReply={setReply}
                  handleDelete={handleCommentDelete}
                  handleEdit={handleCommentEdit}
                />
                {comment.replies.length !== 0 && (
                  <div className={style['replies']}>
                    {comment.replies.map((reply) => {
                      const replyTemp: ReplyType = {
                        _id: String(reply._id) ?? '',
                        author: reply.author,
                        authorName: reply.authorName,
                        content: reply.content,
                      };
                      return <Reply reply={replyTemp} />;
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={style['empty']}>댓글이 없습니다</div>
          )}
        </div>
        <div className={style['input']}>
          <textarea
            placeholder="댓글을 입력해주세요"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setComment('');
              writeComment();
            }}
          >
            입력
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className={style['error']}>에러가 발생했습니다.</div>
  );
};

export default page;
