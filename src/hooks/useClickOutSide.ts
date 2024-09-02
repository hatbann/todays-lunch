/** @format */

import { useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  const clickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback?.();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [ref, callback]);
};
