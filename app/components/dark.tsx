"use client";

import { useDarkBackgroundStore } from "../store/darkBackground";
import { motion } from "framer-motion";

export default function DarkBackground() {
  const darkBackground = useDarkBackgroundStore(
    (state) => state.darkBackground
  );
  return (
    <motion.div
      animate={{
        pointerEvents: darkBackground ? "all" : "none",
        backgroundColor: darkBackground ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0)",
        backdropFilter: darkBackground ? "blur(3px)" : "blur(0px)",
      }}
      className=" z-[99] w-svw h-svh absolute top-0 left-0"
    />
  );
}
