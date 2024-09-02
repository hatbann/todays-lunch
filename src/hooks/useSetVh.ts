/** @format */

import { useEffect } from "react";

// variable.scss에 $dvh: var(--vh, 1vh) 선언
export function useSetVh() {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  useEffect(() => {
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("touchend", setVh);
    console.log("dvh set");

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("touchend", setVh);
      console.log("dvh unset");
    };
  }, []);
}
