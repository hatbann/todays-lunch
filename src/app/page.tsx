/** @format */
'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { RecipeType } from '@/model/recipe';
import style from '../styles/pages/recipe/style.module.scss';

export default function Home() {
  const [recipe, setRecipe] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.NODE_ENV === 'production'
            ? '/api'
            : `${process.env.NEXT_PUBLIC_API_URL!}/api`;

        const response = await fetch(`${API_URL}/lunch`, {
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

        setRecipe(response);
      } catch (error) {}
    };

    fetchData();
  }, []);

  console.log(recipe);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipe.length !== 0 ? (
        <section>
          {recipe.map((item, idx) => {
            return (
              <div>
                <p>{item.title}</p>
              </div>
            );
          })}
        </section>
      ) : (
        <div className={style['empty-container']}>글이 없습니다</div>
      )}
    </main>
  );
}
