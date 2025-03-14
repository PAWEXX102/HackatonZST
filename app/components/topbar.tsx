"use client";

import { Button } from "@heroui/button";
import { useScroll } from "../store/scroll";
import { useUser } from "../store/user";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Input,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useDeviceStore } from "../store/device";
import { useState, useEffect } from "react";
import { Buttons } from "../constants";
import { DeviceButtons } from "../constants";
import { useSizeStore } from "../store/size";
import { useProfileStore } from "../store/profile";
import { usePathname } from "next/navigation";
import { useFocus } from "../store/focus";
import { useSpeechToText } from "../hooks/useSpeechToText";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import Image from "next/image";
import { db, auth } from "@/services/firebase";
import { useSearchStore } from "../store/search";
import { CensoredTexts } from "../constants";
import { useOrientation } from "../store/orientation";
import ProfileDrawer from "./profileDrawer";
import ThemeSwitcher from "./themeSwitcher";

const SearchComponent = () => {
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  return (
    <motion.div
      animate={{
        x: search ? 0 : "100%",
        opacity: search ? 1 : 0,
      }}
      transition={{ damping: 10 }}
      key={1}
      className={` w-full `}
      onClick={() => setSearch("")}
    >
      <motion.div className=" w-full p-2 flex justify-between cursor-pointer">
        <div className=" flex items-center gap-x-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 512 512"
            fill="#a3a3a3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
          </svg>
          <h1 className=" font-bold text-neutral-400">{search}</h1>
        </div>
        <Button variant="light" isIconOnly>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="#a3a3a3"
          >
            <path d="M23.561,23.561c-.293,.293-.677,.439-1.061,.439s-.768-.146-1.061-.439L3,5.121V13.5c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5V4.5C0,2.019,2.019,0,4.5,0H13.5c.829,0,1.5,.671,1.5,1.5s-.671,1.5-1.5,1.5H5.121L23.561,21.439c.586,.585,.586,1.536,0,2.121Z" />
          </svg>
        </Button>
      </motion.div>
      <Divider />
    </motion.div>
  );
};

const RecentSearchComponent = ({
  title,
  index,
}: {
  title: string;
  index: number;
}) => {
  const deleteRef = useRef<HTMLButtonElement>(null);
  const handleDragEnd = async (
    search: string,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (info.offset.x < -50) {
      try {
        await handleDelete(search);
      } catch (error) {
        console.error("Failed to delete search:", error);
      }
    }
  };

  const handleDragMove = (e: any, info: { offset: { x: number } }) => {
    console.log("dwddwdw");
    setOffset(info.offset.x);
    console.log(info.offset.x);
  };

  const handleDelete = async (search: string) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const recentSearches = userDoc.data().recentSearches || [];
          const index = recentSearches.indexOf(search);
          if (index > -1) {
            recentSearches.splice(index, 1);
          }
          await updateDoc(doc(db, "users", user.uid), {
            recentSearches: recentSearches,
          });
        }
      } catch (error) {
        console.error("Error handling delete operation:", error);
      }
    }
  };

  const handleAddRecent = (title: string) => {
    setSearch(search + title);
  };

  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const setSearch = useSearchStore((state) => state.setSearch);
  const setFocus = useFocus((state) => state.setFocus);
  const user = useUser((state: any) => state.user);
  const search = useSearchStore((state) => state.search);
  const [offset, setOffset] = useState(0);
  return (
    <motion.div
      animate={{
        x: search ? "-100%" : 0,
        opacity: search ? 0 : 1,
        display: search ? "none" : "block",
      }}
      transition={{ damping: 10 }}
      key={index}
      className={` w-full `}
    >
      <motion.div
        onDragEnd={(e, info) => handleDragEnd(title, info)}
        onDrag={(e, info) => handleDragMove(e, info)}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        onClick={() => {
          setSearch(title);
          router.push(`/search?s=${title}`);
          setFocus(false);
          if (searchRef.current) searchRef.current.blur();
        }}
        dragElastic={{ left: 0.3 }}
        className=" w-full p-2 flex justify-between cursor-pointer"
      >
        <div className=" flex items-center gap-x-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#a3a3a3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12,24C5.383,24,0,18.617,0,12S5.383,0,12,0s12,5.383,12,12-5.383,12-12,12Zm0-21C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.963,3,12,3Zm5,9.5c0-.828-.672-1.5-1.5-1.5h-2.5V6.5c0-.828-.671-1.5-1.5-1.5s-1.5,.672-1.5,1.5v6c0,.828,.671,1.5,1.5,1.5h4c.828,0,1.5-.672,1.5-1.5Z" />
          </svg>
          <h1 className=" font-bold text-neutral-400">{title}</h1>
        </div>
        <Button
          variant="light"
          isIconOnly
          onPress={() => handleAddRecent(title)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="#a3a3a3"
          >
            <path d="M23.561,23.561c-.293,.293-.677,.439-1.061,.439s-.768-.146-1.061-.439L3,5.121V13.5c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5V4.5C0,2.019,2.019,0,4.5,0H13.5c.829,0,1.5,.671,1.5,1.5s-.671,1.5-1.5,1.5H5.121L23.561,21.439c.586,.585,.586,1.536,0,2.121Z" />
          </svg>
        </Button>
        <Button
          ref={deleteRef}
          isIconOnly
          style={{
            transform: `scale(${
              offset < 0 && deleteRef.current
                ? Math.min(Math.abs(offset) / 150, 1)
                : 0
            })`,
          }}
          className={` bg-transparent font-bold text-red-400 absolute right-[-40px] `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="#f87171"
          >
            <g>
              <path d="M448,85.333h-66.133C371.66,35.703,328.002,0.064,277.333,0h-42.667c-50.669,0.064-94.327,35.703-104.533,85.333H64   c-11.782,0-21.333,9.551-21.333,21.333S52.218,128,64,128h21.333v277.333C85.404,464.214,133.119,511.93,192,512h128   c58.881-0.07,106.596-47.786,106.667-106.667V128H448c11.782,0,21.333-9.551,21.333-21.333S459.782,85.333,448,85.333z    M234.667,362.667c0,11.782-9.551,21.333-21.333,21.333C201.551,384,192,374.449,192,362.667v-128   c0-11.782,9.551-21.333,21.333-21.333c11.782,0,21.333,9.551,21.333,21.333V362.667z M320,362.667   c0,11.782-9.551,21.333-21.333,21.333c-11.782,0-21.333-9.551-21.333-21.333v-128c0-11.782,9.551-21.333,21.333-21.333   c11.782,0,21.333,9.551,21.333,21.333V362.667z M174.315,85.333c9.074-25.551,33.238-42.634,60.352-42.667h42.667   c27.114,0.033,51.278,17.116,60.352,42.667H174.315z" />
            </g>
          </svg>
        </Button>
      </motion.div>
      <Divider />
    </motion.div>
  );
};

interface NotificationProps {
  title: string;
  isSeen: boolean;
  sendTime: Timestamp;
}

export default function Topbar() {
  const scroll = useScroll((state) => state.scroll);
  const [selected, setSelected] = useState("/");
  const profileOpen = useProfileStore((state) => state.profileOpen);
  const setProfileOpen = useProfileStore((state) => state.setProfileOpen);
  const user = useUser((state: any) => state.user);
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isSmall = useSizeStore((state) => state.isSmall);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const orientation = useOrientation((state) => state.orientation);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState<
    Array<NotificationProps>
  >([]);

  const focus = useFocus((state) => state.focus);
  const setFocus = useFocus((state) => state.setFocus);
  const { transcript, listening, startListening, stopListening } =
    useSpeechToText();
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);

  const setIsSmall = useSizeStore((state) => state.setIsSmall);

  const getFirstLetters = (displayName: string) => {
    if (!displayName) return "";
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  const startStopListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const fetchUserRecentSearches = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user?.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRecentSearches(data?.recentSearches || []);
      }
    });
    return () => unsubscribe();
  };

  const fetchUserNotifications = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user?.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log(data.notifications);
        setUserNotifications(data?.notifications || []);
      }
    });
    return () => unsubscribe();
  };

  const calculateTime = (sendTime: Timestamp) => {
    const time = sendTime.toDate();
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleReset = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          recentSearches: [],
        });
      } catch (error) {
        console.error("Error resetting recent searches:", error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (user && focus) {
          router.push(`/search?s=${search}`);
          setFocus(false);
          if (searchRef.current) searchRef.current.blur();
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const recentSearches = userDoc.data().recentSearches || [];
            if (recentSearches.length > 5) {
              recentSearches.pop();
            }
            if (search.length > 0) {
              const existingIndex = recentSearches.indexOf(search);
              if (existingIndex !== -1) {
                recentSearches.splice(existingIndex, 1);
              }
              recentSearches.unshift(search);
              await updateDoc(userRef, { recentSearches });
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [search, user, focus]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserRecentSearches();
      await fetchUserNotifications();
    };

    fetchData();
  }, [user]);

  const handleDragEndNotification = (
    e: any,
    info: { offset: { x: number } },
    index: number
  ) => {
    console.log(info.offset.x);
    if (info.offset.x < -150) {
      handleDeleteNotification(index);
    }
  };

  const verifyText = (text: string) => {
    let censored = false;
    CensoredTexts.forEach((censoredText) => {
      if (text.toLowerCase().includes(censoredText.toLowerCase())) {
        censored = true;
      }
    });
    return censored;
  };

  const handleSearch = () => {
    if (verifyText(transcript) || verifyText(search)) {
      setSearch("");
    } else {
      setSearch(transcript || search);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [transcript, search]);

  const variant = {
    true: {
      opacity: 1,
      filter: "blur(0px)",
      y: 12,
      transition: {
        duration: 0.2,
      },
    },
    false: {
      opacity: 0,
      y: "-10%",
      transition: {
        duration: 0.2,
      },
    },
    focus: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    if (selected !== pathname) {
      setSelected(pathname);
    }
  }, [pathname, selected]);

  const handleSelectionChange = (href: any) => {
    setSearch("");
    if (!isMobile && user && href === "Device") {
      setIsSmall(false);
      setProfileOpen(false);
      return;
    }
    // Usuń linię z samotnym "0;"

    // Kliknięcie w inną ścieżkę
    if (pathname !== href && pathname !== "/login") {
      setSelected(href);
      router.push(href);
      return;
    }
  };

  const handleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleDeleteNotification = async (index: number) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const notifications = userDoc.data().notifications || [];
          notifications.splice(index, 1);
          await updateDoc(userRef, { notifications });
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (user && userNotifications.length > 0) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { notifications: [] });
      } catch (error) {
        console.error("Error deleting all notifications:", error);
      }
    }
  };

  const handleSeenNotification = async (index: number) => {
    if (user) {
      try {
        console.log(index);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const notifications = userDoc.data().notifications || [];
          notifications[index].isSeen = true;
          await updateDoc(userRef, { notifications });
        }
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
  };

  return (
    <>
      {user && pathname !== "/verify-email" && (
        <div
          className={` absolute w-full h-svh flex transition-opacity flex-col ${
            focus && "backdrop-blur-xl z-10"
          } `}
        >
          {isMobile && (
            <ProfileDrawer
              isOpen={profileDrawerOpen}
              setIsOpen={setProfileDrawerOpen}
            />
          )}
          <>
            <motion.div
              initial={{
                height:
                  pathname === "/search"
                    ? focus
                      ? isMobile
                        ? "4.5rem"
                        : "4.5rem"
                      : isMobile
                      ? "8.5rem"
                      : isSmall
                      ? "9rem"
                      : "4.5rem"
                    : "4.5rem",
              }}
              animate={{
                pointerEvents:
                  pathname !== "/search"
                    ? isMobile || isSmall
                      ? "auto"
                      : "none"
                    : "auto",
                height:
                  pathname === "/search"
                    ? focus
                      ? isMobile
                        ? "4.5rem"
                        : "4.5rem"
                      : isMobile
                      ? orientation === "landscape"
                        ? "9.5rem"
                        : "8.5rem"
                      : isSmall
                      ? "9rem"
                      : "4.5rem"
                    : isMobile
                    ? "4.3rem"
                    : "4.5rem",
              }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className={` left-0 transition-opacity  border-b z-10 right-0 mx-auto w-full ${
                scroll > 0
                  ? !focus
                    ? " border-opacity-100 border-zinc-200 bg-white bg-opacity-90 backdrop-blur-3xl dark:border-zinc-70"
                    : " border-opacity-0 border-zinc-200 border-transparent  dark:border-zinc-70 bg-opacity-30"
                  : " border-opacity-0 border-zinc-200 dark:border-zinc-700"
              } flex flex-col relative dark:border-zinc-700 z-10 items-center `}
            >
              <motion.div
                initial={[
                  isMobile ? "true" : isSmall ? "true" : "false",
                  focus ? "focus" : "",
                ]}
                variants={variant}
                transition={{ ease: "easeOut", duration: 0.2 }}
                animate={[
                  isMobile ? "true" : isSmall ? "true" : "false",
                  focus ? "focus" : "",
                ]}
                className={` flex items-center justify-between px-5 w-full gap-x-2 ${
                  focus && "pointer-events-none"
                } ${
                  isSmall || isMobile
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
              >
                {!isMobile && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    animate={{
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    onClick={handleProfile}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                    className="bg-gradient-to-t from-zinc-400 to-zinc-300 size-8 cursor-pointer text-xs font-semibold rounded-full z-50 text-white flex items-center justify-center"
                  >
                    {getFirstLetters(user?.displayName)}
                  </motion.div>
                )}
                {isMobile && (
                  <Dropdown
                    placement="bottom-start"
                    backdrop="blur"
                    classNames={{
                      content: " rounded-3xl  p-0 origin-top-right ",
                      backdrop: "bg-white/10 backdrop-blur-xl",
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
                      <Button isIconOnly className="  bg-transparent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Filled"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="#a1a1aa"
                        >
                          <path d="M7.424,21a4.99,4.99,0,0,0,9.152,0Z" />
                          <path d="M22.392,12.549,20.656,6.826A9.321,9.321,0,0,0,2.58,7.28L1.232,12.817A5,5,0,0,0,6.09,19H17.607a5,5,0,0,0,4.785-6.451Z" />
                        </svg>
                        <div className=" size-4 bg-white flex items-center top-1 right-1 justify-center absolute rounded-full">
                          <div
                            className={` size-3 transition-colors rounded-full ${
                              userNotifications.every(
                                (notification) => notification.isSeen
                              )
                                ? "bg-zinc-300"
                                : "bg-blue-400"
                            }`}
                          />
                        </div>
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      closeOnSelect={false}
                      disabledKeys={["Brak powiadomień"]}
                      classNames={{
                        base: [
                          `p-0 rounded-3xl ${
                            userNotifications.length > 0
                              ? "h-auto"
                              : "h-[15rem]"
                          }  w-[20rem] border-zinc-200 bg-opacity-0  data-[hover=true]:text-white`,
                        ],
                        list: "gap-0",
                      }}
                    >
                      <DropdownItem
                        closeOnSelect={false}
                        classNames={{
                          base: " rounded-none border-zinc-200 data-[hover=true]:bg-white py-4 pl-5 opacity-100 text-black",
                          title:
                            "font-extrabold text-xl flex gap-x-2 items-center",
                        }}
                        key={"Title"}
                      >
                        <div className=" flex items-center justify-between w-full">
                          <h1>Powiadomienia</h1>
                          <Button
                            size="sm"
                            onPress={() => handleDeleteAllNotifications()}
                            className="text-blue-400 font-bold text-sm bg-transparent min-w-10"
                          >
                            Wyczyść
                          </Button>
                        </div>
                      </DropdownItem>
                      {userNotifications && userNotifications.length > 0 ? (
                        <>
                          {userNotifications.map((notification, index) => (
                            <DropdownItem
                              classNames={{
                                base: " rounded-none border-zinc-200 border-t py-3 px-4 data-[hover=true]:bg-zinc-100 text-zinc-400",
                                title: "font-bold text-lg",
                              }}
                              onMouseEnter={() => handleSeenNotification(index)}
                              key={index}
                            >
                              <motion.div
                                drag="x"
                                onDragEnd={(e, info) =>
                                  handleDragEndNotification(e, info, index)
                                }
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={{ left: 0.5 }}
                                className=" flex w-full h-full items-center justify-between"
                              >
                                <div
                                  className={`flex items-center transition-colors ${
                                    notification.isSeen
                                      ? "text-zinc-400"
                                      : "text-blue-400"
                                  } gap-x-2`}
                                >
                                  <div
                                    className={` ${
                                      notification.isSeen
                                        ? "bg-zinc-200"
                                        : "bg-blue-400"
                                    } size-2 transition-colors rounded-full`}
                                  />
                                  {notification.title}
                                </div>
                                <div className=" text-sm font-bold text-zinc-300">
                                  {calculateTime(notification.sendTime)}
                                </div>
                              </motion.div>
                            </DropdownItem>
                          ))}
                        </>
                      ) : (
                        <DropdownItem
                          key={"No Notifications"}
                          classNames={{
                            base: "w-full h-full opacity-100 absolute text-black",
                          }}
                        >
                          <div className=" w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400">
                            Brak powiadomień
                          </div>
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                )}
                <Tabs
                  onSelectionChange={handleSelectionChange}
                  radius="full"
                  color="primary"
                  selectedKey={selected}
                  size={`${isMobile ? "md" : "lg"}`}
                  classNames={{
                    tab: "font-bold px-4",
                    tabContent: "text-black",
                  }}
                >
                  {!isMobile && (
                    <Tab
                      key={"Device"}
                      title={
                        <motion.svg
                          animate={{ opacity: isMobile ? 0 : 1 }}
                          initial={{ opacity: isMobile ? 0 : 1 }}
                          xmlns="http://www.w3.org/2000/svg"
                          id="Outline"
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                        >
                          <path d={DeviceButtons[1].d} />
                        </motion.svg>
                      }
                    />
                  )}
                  {Buttons.map((button: any) => (
                    <Tab
                      key={button.href}
                      title={
                        button.iconSmall ? (
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              id="Capa_1"
                              x="0px"
                              y="0px"
                              viewBox="0 0 513.749 513.749"
                              width="16"
                              height="16"
                              fill={pathname === button.href ? "#60a5fa" : ""}
                            >
                              <g>
                                <path d={button.dTop} />
                              </g>
                            </svg>
                          </div>
                        ) : (
                          button.title
                        )
                      }
                    />
                  ))}
                </Tabs>
                <div className="flex items-center gap-x-2">
                  {/*
                {!user ? (
                  <Button
                    variant="light"
                    className=" text-blue-400 font-bold text-lg"
                  >
                    Login
                  </Button>
                ) : (
                  <motion.div
                    initial={{
                      borderRadius: "100%",
                      opacity: profileOpen ? 0.5 : 1,
                    }}
                    animate={{
                      borderRadius: "100%",
                      opacity: profileOpen ? 0.5 : 1,
                    }}
                    onClick={handleProfile}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                    className="bg-gradient-to-t from-zinc-400 to-zinc-300 size-8 cursor-pointer text-xs font-semibold rounded-full z-50 text-white flex items-center justify-center"
                  >
                    {getFirstLetters(user?.displayName)}
                  </motion.div>
                )}
                */}
                  {!isMobile && (
                    <Dropdown
                      placement="bottom-end"
                      classNames={{
                        content: " rounded-3xl  p-0 origin-top-right ",
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
                        <Button
                          isIconOnly
                          className=" outline-none  bg-transparent"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Filled"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="#a1a1aa"
                          >
                            <path d="M7.424,21a4.99,4.99,0,0,0,9.152,0Z" />
                            <path d="M22.392,12.549,20.656,6.826A9.321,9.321,0,0,0,2.58,7.28L1.232,12.817A5,5,0,0,0,6.09,19H17.607a5,5,0,0,0,4.785-6.451Z" />
                          </svg>
                          <div className=" size-4 bg-white flex items-center top-1 right-1 justify-center absolute rounded-full">
                            <div
                              className={` size-3 transition-colors rounded-full ${
                                userNotifications.every(
                                  (notification) => notification.isSeen
                                )
                                  ? "bg-zinc-300"
                                  : "bg-blue-400"
                              }`}
                            />
                          </div>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        closeOnSelect={false}
                        disabledKeys={["No Notifications"]}
                        classNames={{
                          base: [
                            `p-0 rounded-3xl ${
                              userNotifications.length > 0
                                ? "h-auto"
                                : "h-[15rem]"
                            }  w-[20rem] border-zinc-200 bg-opacity-0  data-[hover=true]:text-white`,
                          ],
                          list: "gap-0",
                        }}
                      >
                        <DropdownItem
                          closeOnSelect={false}
                          classNames={{
                            base: " rounded-none border-zinc-200 data-[hover=true]:bg-white py-4 pl-5 opacity-100 text-black",
                            title:
                              "font-extrabold text-xl flex gap-x-2 items-center",
                          }}
                          key={"Title"}
                        >
                          <div className=" flex items-center justify-between w-full">
                            <h1>Powiadomienia</h1>
                            <Button
                              size="sm"
                              onPress={() => handleDeleteAllNotifications()}
                              className="text-blue-400 font-bold text-sm bg-transparent min-w-10"
                            >
                              Wyczyść
                            </Button>
                          </div>
                        </DropdownItem>
                        {userNotifications && userNotifications.length > 0 ? (
                          <>
                            {userNotifications.map((notification, index) => (
                              <DropdownItem
                                classNames={{
                                  base: " rounded-none border-zinc-200 border-t py-3 px-4 data-[hover=true]:bg-zinc-100 text-zinc-400",
                                  title: "font-bold text-lg",
                                }}
                                onMouseEnter={() =>
                                  handleSeenNotification(index)
                                }
                                key={index}
                              >
                                <motion.div
                                  drag="x"
                                  onDragEnd={(e, info) =>
                                    handleDragEndNotification(e, info, index)
                                  }
                                  dragConstraints={{ left: 0, right: 0 }}
                                  dragElastic={{ left: 0.5 }}
                                  className=" flex w-full h-full items-center justify-between"
                                >
                                  <div
                                    className={`flex items-center transition-colors ${
                                      notification.isSeen
                                        ? "text-zinc-400"
                                        : "text-blue-400"
                                    } gap-x-2`}
                                  >
                                    <div
                                      className={` ${
                                        notification.isSeen
                                          ? "bg-zinc-200"
                                          : "bg-blue-400"
                                      } size-2 transition-colors rounded-full`}
                                    />
                                    {notification.title}
                                  </div>
                                  <div className=" text-sm font-bold text-zinc-300">
                                    {calculateTime(notification.sendTime)}
                                  </div>
                                </motion.div>
                              </DropdownItem>
                            ))}
                          </>
                        ) : (
                          <DropdownItem
                            key={"No Notifications"}
                            classNames={{
                              base: "w-full h-full opacity-100 absolute text-black",
                            }}
                          >
                            <div className=" w-full h-full flex backdrop-blur-md items-center justify-center text-xl font-bold text-zinc-400">
                              Brak powiadomień
                            </div>
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  )}
                  {!isMobile && (
                    <Dropdown
                      placement="bottom-end"
                      classNames={{
                        content: " rounded-3xl  mx-auto p-0 origin-top-right ",
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
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          radius="full"
                          className="bg-zinc-400 outline-none  size-8 cursor-pointer text-xs font-semibold rounded-full z-50 text-white flex items-center justify-center"
                        >
                          {getFirstLetters(
                            user?.displayName
                          ).toLocaleUpperCase()}
                        </Button>
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
                            base: " rounded-none border-zinc-200 py-3 px-4 opacity-100 data-[hover=true]:text-white text-zinc-300",
                            title:
                              "font-bold text-md flex gap-x-2 items-center",
                          }}
                          key={"Profile"}
                        >
                          <div className="bg-zinc-400 opacity-100 size-12  cursor-pointer text-lg font-semibold rounded-2xl z-50 text-white  flex items-center justify-center">
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
                            base: " rounded-none border-t border-zinc-200 data-[hover=true]:bg-white data-[hover=true]:text-black py-3 px-5 opacity-100 text-black",
                          }}
                          key={"Theme"}
                        >
                          <ThemeSwitcher />
                        </DropdownItem>
                        <DropdownItem
                          classNames={{
                            base: " rounded-none border-t border-zinc-200 data-[hover=true]:bg-red-400/20 data-[hover=true]:text-red-400 py-3 pl-5 opacity-100 text-red-400",
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
                  )}
                  {isMobile && (
                    <Button
                      onPress={() => setProfileDrawerOpen(true)}
                      isIconOnly
                      variant="light"
                      size="sm"
                      radius="full"
                      className="bg-zinc-400 outline-none  size-8 cursor-pointer text-xs font-semibold rounded-full z-50 text-white flex items-center justify-center"
                    >
                      {getFirstLetters(user.displayName).toLocaleUpperCase()}
                    </Button>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{
                  y: isMobile ? (orientation === "portrait" ? -12 : -8) : -12,
                  bottom: 0,
                  scale: pathname === "/search" ? 1 : 1.05,
                  filter: pathname === "/search" ? "blur(0px)" : "blur(50px)",
                  display: pathname === "/search" ? "flex" : "none",
                  opacity: pathname === "/search" ? 1 : 0,
                  paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
                }}
                animate={{
                  y: isMobile ? (orientation === "portrait" ? -12 : -8) : -12,
                  bottom: 0,
                  scale: pathname === "/search" ? 1 : 1.05,
                  filter: pathname === "/search" ? "blur(0px)" : "blur(50px)",
                  display: pathname === "/search" ? "flex" : "none",
                  opacity: pathname === "/search" ? 1 : 0,
                  paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
                }}
                className={` h-max w-full px-[1rem] absolute flex `}
              >
                <motion.div
                  initial={{ paddingRight: focus ? "1rem" : "0rem" }}
                  animate={{ paddingRight: focus ? "1rem" : "0rem" }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                  className="w-full relative h-max"
                >
                  <Input
                    type="search"
                    ref={searchRef}
                    onFocus={() => setFocus(true)}
                    isClearable
                    className="w-full rounded-full"
                    classNames={{
                      input: "font-bold text-black",
                    }}
                    startContent={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 513.749 513.749"
                        width="18"
                        height="18"
                        fill="transparent"
                      >
                        <path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
                      </svg>
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="md"
                    radius="lg"
                    onClear={() => setSearch("")}
                  />
                  <motion.div
                    animate={{
                      left: focus || search.length > 0 ? "0.6rem" : "50%",
                      transform:
                        focus || search.length > 0
                          ? "translateX(0)"
                          : "translateX(-50%)",
                    }}
                    className={`absolute pointer-events-none mx-auto h-max !flex gap-x-2 items-center top-0 bottom-0 my-auto w-max`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 513.749 513.749"
                      width="18"
                      height="18"
                      fill="#a3a3a3"
                    >
                      <path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
                    </svg>
                    <motion.h1
                      animate={{
                        opacity: search.length > 0 ? 0 : 1,
                        y: search.length > 0 ? -5 : 0,
                      }}
                      transition={{ duration: 0.1 }}
                      className=" text-zinc-400 font-bold"
                    >
                      {listening ? "Listening..." : "Wyszukaj coś"}
                    </motion.h1>
                  </motion.div>
                  <motion.div
                    initial={{
                      opacity: search.length > 0 ? 0 : 1,
                      display: search.length > 0 ? "none" : "block",
                      right: focus ? 20 : 5,
                    }}
                    transition={{ duration: 0.1 }}
                    animate={{
                      opacity: search.length > 0 ? 0 : 1,
                      display: search.length > 0 ? "none" : "block",
                      right: focus ? 20 : 5,
                    }}
                    className="absolute top-0 bottom-0 my-auto right-6 h-max w-max"
                  >
                    <Button
                      isIconOnly
                      onPress={() => startStopListening()}
                      radius="md"
                      size="sm"
                      className="z-50"
                      variant="light"
                    >
                      <Image
                        src={`/${
                          listening ? "microphoneFill" : "microphone"
                        }.svg`}
                        alt="search"
                        className=" text-zinc-400"
                        width={18}
                        height={18}
                      />
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.button
                  variants={{
                    true: { width: "auto", opacity: 1, y: 0, scale: 1 },
                    false: { width: 0, opacity: 0, y: 0, scale: 0.9 },
                  }}
                  initial={{ width: 0, opacity: 0, y: 0, scale: 0.9 }}
                  onClick={() => {
                    setFocus(false);
                    setSearch("");
                  }}
                  animate={focus ? "true" : "false"}
                  className="text-blue-400 cursor-pointer origin-center font-bold text-lg"
                >
                  Anuluj
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, ease: "easeOut" }}
              initial={{
                y: focus ? 0 : "10%",
                opacity: focus ? 1 : 0,
                paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
                paddingRight: isMobile || isSmall ? "1rem" : "1rem",
                zIndex: focus ? 5 : -1,
              }}
              animate={{
                y: focus ? 0 : "10%",
                opacity: focus ? 1 : 0,
                paddingLeft: isMobile || isSmall ? "1rem" : "20rem",
                paddingRight: isMobile || isSmall ? "1rem" : "1rem",
                zIndex: focus ? 5 : -1,
              }}
              className="w-full bg-opacity-30 overflow-hidden h-full flex flex-col"
            >
              <div className=" flex justify-between items-center pb-2">
                <h1 className=" font-bold text-lg">
                  {search ? `Wyszukujesz '${search}'` : "Ostatnie wyszukiwania"}
                </h1>
                <button
                  onClick={() => {
                    if (!search) {
                      handleReset();
                    } else {
                      setSearch("");
                      router.push("/search?s=");
                      setFocus(false);
                    }
                  }}
                  className=" text-blue-400  font-bold"
                >
                  {!search ? "Resetuj" : "Cofnij"}
                </button>
              </div>
              <Divider />
              <div
                className={` w-full h-full flex relative flex-col items-center `}
              >
                <div
                  className={` w-full flex h-full flex-col items-center absolute ${
                    recentSearches.length === 0
                      ? "justify-center"
                      : " justify-start"
                  }`}
                >
                  {recentSearches.length === 0 ? (
                    <motion.div
                      animate={{
                        opacity: search ? 0 : 1,
                        display: search ? "none" : "flex",
                        scale: search ? 0.5 : 1,
                      }}
                      className=" flex flex-col items-center gap-y-5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 513.749 513.749"
                        width="100"
                        height="100"
                        fill="#a3a3a3"
                      >
                        <g>
                          <path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15   S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0   c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160   s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
                        </g>
                      </svg>
                      <h1 className=" font-extrabold text-3xl text-zinc-400">
                        Brak ostatnich wyszukiwań
                      </h1>
                    </motion.div>
                  ) : (
                    recentSearches.map((title: any, index: number) => (
                      <RecentSearchComponent
                        title={title}
                        index={index}
                        key={index}
                      />
                    ))
                  )}
                </div>
                <SearchComponent />
              </div>
            </motion.div>
          </>
        </div>
      )}
    </>
  );
}
