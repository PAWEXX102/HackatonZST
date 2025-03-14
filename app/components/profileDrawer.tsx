
import { motion } from "framer-motion";
import { useUser } from "../store/user";
import { useEffect, useRef } from "react";
import ThemeSwitcher from "./themeSwitcher";

export default function ProfileDrawer({
  isOpen = false,
  setIsOpen = () => {},
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const getFirstLetters = (displayName: string) => {
    if (!displayName) return "";
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  const user = useUser((state: any) => state.user);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleDragEnd = (e: any, info: any) => {
    console.log(info.velocity.y);
    console.log(info.point.y);
    if (info.point.y > 800) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.div
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: { ease: "easeInOut", duration: 0.2 },
        }}
        className=" absolute w-full h-full bg-black/40 z-40"
      />
      <motion.div
        onDragEnd={handleDragEnd}
        drag="y"
        aria-label="Profile Drawer"
        aria-modal="true"
        role="dialog"
        ref={ref}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ bottom: 0.5 }}
        animate={{
          y: isOpen ? 0 : "100%",
          opacity: isOpen ? 1 : 0,
          transition: { ease: "easeInOut", duration: 0.2 },
        }}
        className=" absolute bottom-0 flex flex-col  w-full z-50 border-zinc-200 border-t rounded-t-3xl bg-white"
      >
        <div className=" absolute w-[10%] h-[4px] bg-zinc-300 right-0 left-0 top-1 rounded-full mx-auto bottom-0" />
        <div className=" flex gap-x-2 items-center p-5">
          <div className="bg-zinc-400 opacity-100 size-14  cursor-pointer text-lg font-semibold rounded-2xl z-50 text-white  flex items-center justify-center">
            {getFirstLetters(user?.displayName).toLocaleUpperCase()}
          </div>
          <div className=" flex flex-col">
            <h1 className=" text-zinc-700 text-lg leading-5 font-extrabold">
              {user.displayName}
            </h1>
            <h2 className=" text-sm font-bold left-5 text-zinc-400">
              {user.role}
            </h2>
          </div>
        </div>
        <div className=" text-start transition-all py-3 px-5 font-extrabold border-zinc-200 text-lg border-t">
          <ThemeSwitcher />
        </div>
        <button className=" text-start transition-all py-3 hover:bg-red-400 hover:text-white pl-5 text-red-400 font-extrabold border-zinc-200 text-lg border-t">
          Logout
        </button>
      </motion.div>
    </>
  );
}
