import React from 'react';
import style from '../../styles/pages/upload/input.module.scss';

type InputProps = {
  label: string;
  value: string;
  htmlFor: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disable?: boolean;
};

const Input = ({
  label,
  value,
  onChange,
  htmlFor,
  placeholder,
  disable = false,
}: InputProps) => {
  return (
    <div className={style['input-container']}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        type="text"
        id={htmlFor}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disable}
      />
    </div>
  );
};

type TextAreaProps = {
  label: string;
  value: string;
  htmlFor: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
};

const TextArea = ({
  label,
  value,
  onChange,
  htmlFor,
  placeholder,
}: TextAreaProps) => {
  return (
    <div className={style['text-area-container']}>
      <label htmlFor={htmlFor}>{label}</label>
      <textarea
        id={htmlFor}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

type InputImageProps = {
  label?: string;
  value: File | null;
  htmlFor: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

const InputImage = ({
  label,
  value,
  htmlFor,
  onChange,
  onDelete,
}: InputImageProps) => {
  return (
    <div className={style['input-img-container']}>
      {label && <span className={style['title']}>{label}</span>}
      {!value && (
        <>
          <input type="file" id={htmlFor} onChange={onChange} />
          <div className={style['custom-input']}>
            <label htmlFor={htmlFor}>파일선택</label>
          </div>
        </>
      )}
      {value && (
        <div className={style['preview']}>
          <img
            src={URL.createObjectURL(value)}
            className={style['preview-img']}
          />
          <img
            src="/images/png/close.png"
            className={style['delete']}
            onClick={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
export { TextArea, InputImage };
