/** @format */

"use client";

import React, { useState } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
/* import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"; */

type Props = {
  children: React.ReactNode;
};

function Provider({ children }: Props) {
  /*   const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 20000,
        },
      },
    })
  ); */
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Provider;
