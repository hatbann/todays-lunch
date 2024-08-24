import { useForm, useWatch } from 'react-hook-form';
import U from '@/utils/U';
import { useRouter } from 'next/navigation';
import { resolve } from 'path';

type Inputs = {
  userId: string;
  password: string;
};

export const useSinginForm = () => {
  const f = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const r = {
    userId: f.register('userId', {
      required: true,
    }),
    password: f.register('password', {
      required: true,
      pattern: {
        value: U.validPasswordPattern,
        message: '비밀번호 형식을 확인해주세요',
      },
    }),
  };

  return { f, r };
};
