/** @format */
'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { RecipeType } from '@/model/recipe';
import style from '../styles/pages/recipe/style.module.scss';
import { LunchType } from '@/model/lunch';
import Lunch from '@/components/lunch/Lunch';

export default function Home() {
  const [lunch, setLunch] = useState<LunchType[]>([]);
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

        setLunch(response);
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <p>Loading...</p>
      ) : lunch.length !== 0 ? (
        <section className={style['container']}>
          <h2 className={style['title']}>도시락통</h2>
          {lunch.map((item, idx) => {
            return (
              <div key={`${idx}-${item.title}`}>
                <Lunch item={item} />
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
