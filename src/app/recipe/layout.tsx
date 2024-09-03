/** @format */

import React, { Suspense } from "react";
import Loading from "./loading";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default RootLayout;
