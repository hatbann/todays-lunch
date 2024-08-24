import { userType } from '@/types/user.type';
import { atom } from 'recoil';

export const isLoginLoading = atom({
  key: 'isLoginLoading',
  default: true,
});

export const userState = atom<userType>({
  key: 'user',
  default: {
    user_id: '',
    username: '',
    /*     userId: 1,
    username: '햇반', */
  },
});
