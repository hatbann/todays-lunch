/** @format */

import React from "react";
import style from "../../styles/common/modal.module.scss";

type ModalType = {
  title: string;
  subtitle?: string;
  confirm?: string;
  cancel?: string;
  confirmAction?: () => void;
  cancelAction?: () => void;
  visiable: boolean;
};

const Modal = ({
  title,
  subtitle,
  confirm,
  cancel,
  confirmAction,
  cancelAction,
  visiable,
}: ModalType) => {
  return visiable ? (
    <div className={style["modal-wrapper"]}>
      <div className={style["modal-container"]}>
        <div className={style["modal-contents"]}>
          <h3 className={style["title"]}>{title}</h3>
          {subtitle && <p className={style["subtitle"]}>{subtitle}</p>}
        </div>
        <div className={style["btn-container"]}>
          {cancel && cancelAction && (
            <button className={style["cancel"]} onClick={cancelAction}>
              {cancel}
            </button>
          )}
          {confirm && confirmAction && (
            <button className={style["confirm"]} onClick={confirmAction}>
              {confirm}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
