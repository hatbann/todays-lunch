/** @format */

import { useState, useEffect } from "react";
import style from "../../styles/common/pagenation.module.scss";

type Props = {
  page: number;
  setPage: (value: number) => void;
  total: number;
  listLimit: number;
  pageLimit: number;
  theme?: "gray";
  testId?: string;
};

export default function Pagination(props: Props) {
  const { page, setPage, total, listLimit, pageLimit, theme, testId } = props;
  const [pagesArr, setPagesArr] = useState<number[]>([]);

  const pagesNum = total ? Math.ceil(total / listLimit) : 1;
  const firstNum = Math.ceil(page / pageLimit) * pageLimit - 4;
  const lastNum =
    Math.ceil(page / pageLimit) * pageLimit < pagesNum
      ? Math.ceil(page / pageLimit) * pageLimit
      : pagesNum;

  useEffect(() => {
    let newPageArr = [] as number[];
    for (let i = firstNum; i <= lastNum; i++) {
      newPageArr.push(i);
    }
    setPagesArr(newPageArr);
  }, [firstNum, lastNum]);

  return (
    <div
      className={`${style["pagination-btn-wrap"]} ${
        theme === "gray" && style.gray
      }`}>
      <span
        className={
          page > 5
            ? `${style["arrow"]} ${style["active"]}`
            : `${style["arrow"]} ${style["none"]}`
        }
        onClick={() => {
          page > 5 && setPage(firstNum - 1);
        }}>
        <img
          src="/images/png/navarrow.png"
          className={`${style["arrow-img"]} ${style["before"]}`}
        />
      </span>
      <div className={style["page-btn"]}>
        {pagesArr.map((el, index) => (
          <span
            data-testid={testId}
            key={index}
            className={el === page ? `${style["active"]}` : `${style["none"]}`}
            onClick={() => {
              setPage(el);
            }}>
            {el}
          </span>
        ))}
      </div>
      <span
        /*         className={`${pagesNum > lastNum ? style.active : style.none}`} */
        className={
          pagesNum > lastNum
            ? `${style["arrow"]} ${style["active"]}`
            : `${style["arrow"]} ${style["none"]}`
        }
        onClick={() => {
          pagesNum > lastNum && setPage(firstNum + 5);
        }}>
        <img
          src="/images/png/navarrow.png"
          className={`${style["arrow-img"]} ${style["after"]}`}
        />
      </span>
    </div>
  );
}
