'use client';

import { RecipeType } from '@/model/recipe';
import React, { useEffect, useState } from 'react';
import style from '../../styles/pages/recipe/style.module.scss';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';

const page = () => {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.NODE_ENV === 'production'
            ? '/api'
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/recipe`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
          .then((res) => {
            return res.json();
          })
          .catch((e) => {
            console.log(e);
          });

        setRecipes(response);
        setIsLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipes.length !== 0 ? (
        <section className={style['container']}>
          <h2 className={style['title']}>레시피</h2>
          {recipes.map((recipe, idx) => (
            <article key={idx}>
              <h3>{recipe.title}</h3>
            </article>
          ))}
        </section>
      ) : (
        <div className={style['empty-container']}>
          <h3>레시피가 없습니다</h3>

          <button
            onClick={() => {
              if (user.user_id === '') {
                const result = confirm('로그인 후 이용해주세요');
                if (result) {
                  router.push('/login');
                }
              } else {
                router.push('/upload/lunch');
              }
            }}
          >
            레시피 올리기
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
