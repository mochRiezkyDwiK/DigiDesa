import { type Easing } from "framer-motion";

export const EASE_SPRING: Easing = [0.16, 1, 0.3, 1];

export const STAGGER_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SPRING } },
};
