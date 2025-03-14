"use client";
import { useEffect } from "react";
import { useRef } from "react";
import { useScroll } from "../store/scroll";
import { motion } from "framer-motion";
import { useDeviceStore } from "../store/device";
import { useSizeStore } from "../store/size";

export default function Home() {
  const setScroll = useScroll((state) => state.setScroll);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isSmall = useSizeStore((state) => state.isSmall);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setScroll(ref.current.scrollTop);
        console.log(ref.current.scrollTop);
      }
    };

    const currentRef = ref.current;
    currentRef?.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [ref, setScroll]);

  return (
    <motion.div
      ref={ref}
      initial={{
        scale: 1.01,
        paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
      }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      animate={{
        scale: [1.01, 0.99, 1],
        paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
      }}
      className={` overflow-y-scroll pt-[5rem] px-[1rem] flex-col flex  w-full h-full z-[2] `}
    >
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
      <div>dwd</div>
    </motion.div>
  );
}
