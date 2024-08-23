'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';

const Recoil = ({ children }: { children: React.ReactNode }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default Recoil;
