"use client";

import { motion } from "framer-motion";
import { useDeviceStore } from "../store/device";
import { useUser } from "../store/user";
import { useEffect } from "react";
import { Buttons, DeviceButtons } from "../constants";
import { useSizeStore } from "../store/size";
import Image from "next/image";
import { auth } from "@/services/firebase";
import { useFocus } from "../store/focus";
import { usePathname, useRouter } from "next/navigation";
import { onSnapshot, doc } from "firebase/firestore";
import { Button } from "@heroui/button";
import { db } from "@/services/firebase";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ThemeSwitcher from "./themeSwitcher";

export default function Sidebar() {
  const isMobile = useDeviceStore((state: any) => state.isMobile);
  const user = useUser((state: any) => state.user);
  const setUser = useUser((state: any) => state.setUser);
  const isSmall = useSizeStore((state: any) => state.isSmall);
  const setIsSmall = useSizeStore((state: any) => state.setIsSmall);
  const router = useRouter();
  const setFocus = useFocus((state) => state.setFocus);

  const pathname = usePathname();

  const getFirstLetters = (displayName: string) => {
    if (!displayName) return "";
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  const handlePress = (href: string) => {
    if (href !== pathname) {
      router.push(href);
      setFocus(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          console.log("User data is", userData);
          if (userData?.role) {
            setUser({ ...user, role: userData.role });
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user?.uid]);

  return (
    <>
      {user && pathname !== "/login" && pathname !== "/verify-email" && (
        <motion.div
          initial={{ x: isMobile || isSmall ? "-100%" : 0 }}
          animate={{ x: isMobile || isSmall ? "-100%" : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="dark:bg-zinc-800 border-r origin-top absolute bg-stone-100 z-20 w-full justify-between h-full flex flex-col gap-y-4 shadow-xl max-w-[19rem] dark:border-zinc-600"
        >
          <div>
            <div className="h-[4rem] flex z-20 justify-between items-center px-5">
              <div className="flex items-start justify-end gap-x-1">
                <Image
                  src="/logobiale2.png"
                  alt="Logo"
                  width={27}
                  height={27}
                  className=" brightness-0 dark:brightness-100"
                />
                <h1 className="font-extrabold text-2xl">FoodGenius</h1>
              </div>
              <Button
                aria-label="Toggle Sidebar"
                onPress={() => setIsSmall(true)}
                isIconOnly
                className=" bg-transparent hover:fill-neutral-500 transition-transform rotate-180 brightness-0 dark:brightness-100"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                >
                  <path d={DeviceButtons[0].d} />
                </svg>
              </Button>
            </div>
            <motion.div
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={` flex flex-col gap-y-3 p-5`}
            >
              {Buttons?.map((button: any, index: number) => (
                <button
                  onClick={() => handlePress(button.href)}
                  key={index}
                  className={`${
                    pathname === button.href
                      ? "text-blue-400 scale-105 bg-white shadow-neutral-100 shadow-[0_0_10px_rgba(0,0,0,0)] border-blue-400 dark:bg-zinc-600 dark:border-blue-500 dark:text-blue-400"
                      : "text-black hover:bg-zinc-200/70 dark:text-white dark:hover:bg-zinc-200/70"
                  } font-bold px-4 transition-all flex rounded-xl gap-x-3 py-2 items-center justify-start dark:border-red-500 w-full relative text-lg`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    strokeWidth={0.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill={"#60a5fa"}
                    className={`${
                      pathname === button.href && "stroke-blue-400"
                    } transition-all`}
                  >
                    <path d={button.d} />
                  </svg>
                  {button.title}
                </button>
              ))}
            </motion.div>
          </div>
          <div className="flex gap-x-2 items-center p-5 font-bold">
            {user && (
              <>
                <div className="flex flex-row justify-between items-center gap-x-2 w-full rounded-lg">
                  <Dropdown
                    placement="top"
                    offset={10}
                    classNames={{
                      content:
                        " rounded-3xl bg-white backdrop-blur-xl  p-0 origin-top-right ",
                    }}
                    motionProps={{
                      initial: {
                        scale: 0.5,
                        opacity: 0,
                        //filter: "blur(20px)",
                      },
                      animate: {
                        scale: 1,
                        opacity: 1,
                        //filter: "blur(0px)",
                      },
                      exit: {
                        scale: 0,
                        opacity: 0,
                        //filter: "blur(20px)",
                      },
                    }}
                  >
                    <DropdownTrigger>
                      <button className="flex outline-none transition-all flex-row items-center w-full gap-x-2 hover:bg-zinc-200/70 py-2 px-2 rounded-2xl">
                        <div className="cursor-default bg-zinc-400 flex  items-center justify-center  size-8 text-xs font-bold rounded-full text-white">
                          {getFirstLetters(
                            user?.displayName
                          ).toLocaleUpperCase()}
                        </div>
                        <h1 className="text-zinc-400">{user?.displayName}</h1>
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disabledKeys={["Profile"]}
                      classNames={{
                        base: [
                          "p-0 rounded-3xl w-[16rem] border-zinc-200 bg-opacity-0 data-[hover=true]:text-white",
                        ],
                        list: "gap-0",
                      }}
                    >
                      <DropdownItem
                        classNames={{
                          base: " rounded-none border-zinc-200 py-3 px-4 opacity-100 data-[hover=true]:text-white text-zinc-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-800",
                          title: "font-bold text-md flex gap-x-2 items-center",
                        }}
                        key={"Profile"}
                      >
                        <div className="bg-zinc-400 opacity-100 size-12  cursor-pointer text-lg font-bold rounded-2xl z-50 text-white  flex items-center justify-center">
                          {getFirstLetters(
                            user?.displayName
                          ).toLocaleUpperCase()}
                        </div>
                        <div className="">
                          <h1 className=" text-zinc-700 text-base font-extrabold">
                            {user.displayName}
                          </h1>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        closeOnSelect={false}
                        classNames={{
                          base: " rounded-none border-t border-zinc-200 data-[hover=true]:bg-zinc-white data-[hover=true]:text-black py-3 px-3 opacity-100 text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-800",
                          title:
                            "font-extrabold text-lg flex gap-x-2 items-center",
                        }}
                        key={"Theme"}
                      >
                        <ThemeSwitcher />
                      </DropdownItem>
                      <DropdownItem
                        classNames={{
                          base: " rounded-none border-zinc-200 border-t data-[hover=true]:text-red-400 data-[hover=true]:bg-zinc-100 py-3 pl-5 opacity-100 text-red-400 dark:bg-zinc-800 dark:text-red-400 dark:border-zinc-800",
                          title:
                            "font-extrabold text-lg flex gap-x-2 items-center",
                        }}
                        onPress={() => {
                          auth.signOut();
                        }}
                        key={"Logout"}
                      >
                        Wyloguj
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
