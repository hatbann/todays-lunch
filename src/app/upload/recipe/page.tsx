/** @format */

'use client';

import React, { useState } from 'react';
import style from '../../../styles/pages/upload/recipe.module.scss';
import Input, { InputImage, TextArea } from '@/components/upload/Input';
import { IngredientType, StepType } from '@/model/recipe';
import { uploadImageToS3 } from '@/utils/uploadImageToS3';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/user';
import { useRouter } from 'next/navigation';

const page = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDiscription] = useState<string>('');
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [steps, setSteps] = useState<StepType[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientLink, setIngredientLink] = useState<string | undefined>(
    undefined
  );
  const [tempStep, setTempStep] = useState<string>('');
  const [ingredientNameError, setIngredientError] = useState(false);
  const [stepError, setStepError] = useState(false);
  const [img, setImg] = useState<File | null>(null);
  const user = useRecoilValue(userState);
  const router = useRouter();

  const isDisable =
    title.length < 1 ||
    description.length < 1 ||
    ingredients.length === 0 ||
    steps.length === 0;

  const handleWrite = async () => {
    try {
      let bodyData = {};
      if (img) {
        const imgurl = await uploadImageToS3(img);
        bodyData = {
          ...bodyData,
          img: imgurl,
        };
      }
      bodyData = {
        ...bodyData,
        title,
        description,
        author: user.user_id,
        ingredients: ingredients,
        steps: steps,
      };
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

      const response = await fetch(`${API_URL}/recipe`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(bodyData),
      })
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          console.log(e);
        });

      if (response.message === 'success') {
        router.push('/upload/recipe/success');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style['container']}>
      <h2 className={style['title']}>레시피</h2>
      <section className={style['input-section']}>
        <Input
          label={'제목'}
          value={title}
          htmlFor="title"
          onChange={(e) => {
            if (title.length < 50) {
              setTitle(e.target.value);
            }
          }}
          placeholder="제목을 입력하세요(50자 이내)"
        />
        <TextArea
          label={'설명'}
          value={description}
          htmlFor="description"
          onChange={(e) => {
            if (description.length < 500) {
              setDiscription(e.target.value);
            }
          }}
          placeholder="레시피에 대해 간단히 설명해주세요(500자 이내)"
        />
        <div className={style['ingredient-container']}>
          <div className={style['added-ingredient']}>
            <h3>재료</h3>
            {ingredients.length !== 0 ? (
              <div className={style['ingredient-items']}>
                {ingredients.map((ingredient, idx) => {
                  return (
                    <span
                      className={
                        ingredient.link
                          ? `${style['link']} ${style['ingredient']}`
                          : style['ingredient']
                      }
                      onClick={() => {
                        if (ingredient.link) {
                          window.open(ingredient.link);
                        }
                      }}
                    >
                      {ingredient.name}
                      {idx !== ingredients.length - 1 && ', '}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className={style['empty-ingredient']}>
                추가한 재료가 없습니다
              </div>
            )}
          </div>
          <div className={style['ingredient-input']}>
            <Input
              label={'재료 이름'}
              value={ingredientName}
              htmlFor="ingredientName"
              onChange={(e) => {
                if (ingredientName.length < 20) {
                  setIngredientName(e.target.value);
                }
                setIngredientError(false);
              }}
              placeholder="재료 이름을 입력하세요(20자 이내)"
            />
            {ingredientNameError && (
              <div className={style['ingredient-error']}>
                재료 이름은 필수입니다.
              </div>
            )}
            <Input
              label={'재료 구매처'}
              value={ingredientLink ?? ''}
              htmlFor="ingredientLink"
              onChange={(e) => {
                setIngredientLink(e.target.value);
              }}
              placeholder="재료 구매처 링크를 입력하세요(필수 X)"
            />
          </div>
          <div className={style['add-btn']}>
            <button
              onClick={() => {
                if (ingredientName !== '') {
                  const newIngredient: IngredientType = {
                    name: ingredientName,
                    link: ingredientLink,
                  };
                  setIngredients((prev) => [...prev, newIngredient]);
                  setIngredientLink(undefined);
                  setIngredientName('');
                } else {
                  setIngredientError(true);
                }
              }}
            >
              재료 추가
            </button>
          </div>
        </div>
        <div className={style['step-container']}>
          <h3 className={style['title']}>단계</h3>
          {steps.length !== 0 && (
            <div className={style['added-steps']}>
              {steps.map((step, idx) => {
                console.log(step);
                return (
                  <div className={style['step-item']}>
                    <span className={style['step-name']}>{idx + 1} 단계</span>
                    <div className={style['step-content']}>{step.content}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className={style['steps-input']}>
            <span className={style['step-num']}>{steps.length + 1}단계</span>
            <TextArea
              value={tempStep}
              htmlFor={`step-${steps.length + 1}`}
              onChange={(e) => {
                if (tempStep.length < 500) {
                  setTempStep(e.target.value);
                }
              }}
              customStyle={{ width: '100%' }}
              placeholder="조리 방법을 단계별로 작정해주세요(500자 이내)"
            />
            {stepError && (
              <div className={style['step-error']}>설명을 작성해주세요</div>
            )}
          </div>
          <div className={style['add-btn']}>
            <button
              onClick={() => {
                if (tempStep !== '') {
                  const newStep: StepType = {
                    content: tempStep,
                  };
                  setSteps((prev) => [...prev, newStep]);
                  setTempStep('');
                } else {
                  setStepError(true);
                }
              }}
            >
              단계 추가
            </button>
          </div>
        </div>
        <InputImage
          label={'완성사진'}
          value={img}
          htmlFor="img"
          onChange={(e) => {
            if (e.target.files) {
              setImg(e.target.files[0]);
            }
          }}
          onDelete={() => {
            setImg(null);
          }}
        />
        <button
          className={style['write-btn']}
          disabled={isDisable}
          onClick={handleWrite}
        >
          글쓰기
        </button>
      </section>
    </div>
  );
};

export default page;
