/** @format */

export const scrollable = (available: boolean) => {
  document.body.style.overflow = !available ? "hidden" : "auto";
  document.body.style.touchAction = !available ? "none" : "auto";
};
