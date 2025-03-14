"use client";

import { useEffect, useState } from "react";
import React from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/services/firebase";
import Image from "next/image";
import { Tabs, Tab, Input, Button } from "@heroui/react";
import { EyeSlashFilledIcon } from "./Eye";
import { EyeFilledIcon } from "./ClosedEye";
import { motion } from "framer-motion";
import { useDeviceStore } from "../store/device";
import { useRouter } from "next/navigation";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useMemo } from "react";

export default function Login() {
  const [selected, setSelected] = useState("login");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isOpenPasswordPopover, setIsOpenPasswordPopover] = useState(false);
  const router = useRouter();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [requirements, setRequirements] = useState([
    {
      title: "Minimum 8 znaków",
      isValid: false,
    },
    {
      title: "Przynajmniej jedna duża litera",
      isValid: false,
    },
    {
      title: "Przynajmniej jedna mała litera",
      isValid: false,
    },
    {
      title: "Przynajmniej jeden specjalny znak",
      isValid: false,
    },
  ]);

  const memoizedRequirements = useMemo(() => {
    return [
      {
        title: "Minimum 8 znaków",
        isValid: password.length >= 8,
      },
      {
        title: "Przynajmniej jedna duża litera",
        isValid: /[A-Z]/.test(password),
      },
      {
        title: "Przynajmniej jedna mała litera",
        isValid: /[a-z]/.test(password),
      },
      {
        title: "Przynajmniej jeden specjalny znak",
        isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
      },
    ];
  }, [password]);

  useEffect(() => {
    setRequirements(memoizedRequirements);
  }, [memoizedRequirements]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(
        auth,
        provider.setCustomParameters({ prompt: "select_account" })
      );
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          recentSearches: [],
          password: "",
          OTP: "",
        });
        if (auth.currentUser?.emailVerified) {
          router.push("/");
        } else {
          router.push("/verify-email");
        }
      }
      toast.success("Logowanie przebiegło pomyślnie", {
        className: "rounded-2xl",
      });
      if (auth.currentUser?.emailVerified) {
        router.push("/");
      } else {
        router.push("/verify-email");
      }
    } catch (error) {
      toast.error("Nie udało się zalogować przez Google'a", {
        className: "rounded-2xl",
      });
      console.error(error);
    }
  };

  const handleLoginRegister = async () => {
    console.log("Requirements", requirements);
    if (requirements.some((requirement) => !requirement.isValid)) {
      toast.error("Hasło nie spełnia wszystkich wymagań", {
        className: "rounded-2xl",
      });
      return;
    } else {
      try {
        if (selected === "login") {
          if (!email || !password) {
            toast.error("Wypełnij wszystkie pola", {
              className: "rounded-2xl",
            });
            return;
          }

          const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const userDoc = await getDoc(doc(db, "users", result.user.uid));

          if (!userDoc.exists()) {
            throw new Error("Nie znaleziono takiego użytkownika");
          }
          toast.success("Logowanie przebiegło pomyślnie", {
            className: "rounded-2xl",
          });
          if (auth.currentUser?.emailVerified) {
            router.push("/");
          } else {
            router.push("/verify-email");
          }
        } else {
          if (!email || !password || !confirmPassword || !displayName) {
            toast.error("Wypełnij wszystkie pola", {
              className: "rounded-2xl",
            });
            return;
          }

          if (password !== confirmPassword) {
            toast.error("Hasła nie pasują do siebie", {
              className: "rounded-2xl",
            });
            return;
          }

          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await sendEmailVerification(result.user).then(() => {
            console.log("E-Mail wysłany");
          });
          await setDoc(doc(db, "users", result.user.uid), {
            email: email,
            displayName: displayName,
            recentSearches: [],
            password: bcrypt.hashSync(password, 10),
            OTP: "",
          });
          toast.success("Konto zostało pomyślnie założone", {
            className: "rounded-2xl",
          });
          if (auth.currentUser?.emailVerified) {
            router.push("/");
          } else {
            router.push("/verify-email");
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Wystąpił błąd", {
          className: "rounded-2xl",
        });
        console.error(error);
      }
    }
  };

  useEffect(() => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRequirements(
      requirements.map((requirement) => {
        return {
          ...requirement,
          isValid: false,
        };
      })
    );
  }, [selected]);

  return (
    <motion.div className="flex items-center justify-center w-full h-svh bg-no-repeat bg-center bg-cover ">
      <div className=" absolute top-0 left-0 p-4 flex gap-x-1 items-end">
        <Image
          src="/logobiale2.png"
          className=" brightness-0"
          alt="Logo"
          width={40}
          height={40}
        />
        <h1 className=" font-extrabold text-3xl leading-[30px] ml-2">FoodGenius</h1>
      </div>
      <motion.div className=" w-[90%] text-center absolute h-svh flex flex-col items-center sm:gap-y-10 sm:py-8 py-4  overflow-auto"></motion.div>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="items-center justify-center flex flex-col bg-white shadow-zinc-300 max-w-[85%] shadow-[0_0_0px_rgba(0,0,0,10)] p-4  rounded-3xl"
      >
        <h1 className="text-2xl font-extrabold mt-5">
          {selected === "login" ? <p>Witamy ponownie!</p> : <p>Nowy tutaj?</p>}
        </h1>
        <div className="text-sm font-bold text-gray-300 mb-4">
          {selected === "login" ? (
            <p>Zaloguj się aby kontynuować</p>
          ) : (
            <p>Utwórz konto aby kontynuować</p>
          )}
        </div>
        <div className="max-w-full w-[350px] p-2 md:p-4">
          <Tabs
            fullWidth
            size={isMobile ? "md" : "lg"}
            aria-label="Tabs form"
            radius="lg"
            color="primary"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(String(key))}
            classNames={{
              tabContent: `font-extrabold text-md`,
            }}
          >
            <Tab key="login" title="Logowanie" />
            <Tab key="register" title="Rejestracja" />
          </Tabs>
          <motion.div
            initial={{
              height: selected === "login" ? "auto" : "14rem",
            }}
            animate={{
              height: selected === "login" ? "auto" : "14rem",
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="mt-5 flex flex-col items-center justify-center relative h-max"
          >
            <motion.div
              initial={{
                x: selected === "login" ? 0 : "5%",
                opacity: selected === "login" ? 1 : 0,
                //filter: selected === "login" ? "blur(0px)" : "blur(10px)",
              }}
              animate={{
                x: selected === "login" ? 0 : "5%",
                opacity: selected === "login" ? 1 : 0,
                //filter: selected === "login" ? "blur(0px)" : "blur(10px)",
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: selected === "login" ? 0.15 : 0,
              }}
              className=" flex flex-col gap-y-3 w-full"
            >
              <Input
                classNames={{ input: "font-bold" }}
                className=" font-bold"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
                radius="lg"
              />
              <div className=" flex flex-col w-full">
                <Input
                  size="sm"
                  variant="flat"
                  label="Hasło"
                  value={password}
                  onFocusChange={(e) => setIsOpenPasswordPopover(e)}
                  onChange={(e) => setPassword(e.target.value)}
                  radius="lg"
                  classNames={{ input: "font-bold" }}
                  className=" font-bold"
                  type={isVisiblePassword ? "text" : "password"}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                    >
                      {isVisiblePassword ? (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                <motion.div
                  initial={{
                    scale: isOpenPasswordPopover ? 1 : 1.1,
                    filter: isOpenPasswordPopover ? "blur(0px)" : "blur(10px)",
                    opacity: isOpenPasswordPopover ? 1 : 0,
                    pointerEvents: isOpenPasswordPopover ? "auto" : "none",
                  }}
                  animate={{
                    scale: isOpenPasswordPopover ? 1 : 1.1,
                    filter: isOpenPasswordPopover ? "blur(0px)" : "blur(10px)",
                    opacity: isOpenPasswordPopover ? 1 : 0,
                    pointerEvents: isOpenPasswordPopover ? "auto" : "none",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className=" origin-center absolute z-50 bottom-[-110px]  left-0 right-0 text-start items-center mx-auto h-[6rem] w-full"
                >
                  <div className=" w-full h-full bg-white shadow-zinc-300  shadow-[0_0_20px_rgba(0,0,0,20)] rounded-2xl origin-top flex items-start justify-between p-3 flex-col text-xs">
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className={`flex items-center transition-colors font-extrabold  gap-x-2 ${
                          requirement.isValid
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        <div
                          className={` transition-colors w-[5px] h-[5px] ${
                            requirement.isValid ? "bg-green-400" : "bg-red-400"
                          } rounded-full`}
                        />
                        {requirement.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                x: selected === "register" ? 0 : "-5%",
                opacity: selected === "register" ? 1 : 0,
                //filter: selected === "register" ? "blur(0px)" : "blur(10px)",
                position: "absolute",
                pointerEvents: selected === "register" ? "auto" : "none",
              }}
              animate={{
                x: selected === "register" ? 0 : "-5%",
                opacity: selected === "register" ? 1 : 0,
                //filter: selected === "register" ? "blur(0px)" : "blur(10px)",
                position: "absolute",
                pointerEvents: selected === "register" ? "auto" : "none",
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: selected === "register" ? 0.15 : 0,
              }}
              className=" flex flex-col w-full gap-y-3"
            >
              <Input
                classNames={{ input: "font-bold" }}
                className=" font-bold"
                label="Pseudonim"
                value={displayName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  setDisplayName(value);
                }}
                size="sm"
                radius="lg"
              />
              <Input
                classNames={{ input: "font-bold" }}
                className=" font-bold"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
                radius="lg"
              />
              <div className=" flex flex-col w-full">
                <Input
                  size="sm"
                  variant="flat"
                  label="Hasło"
                  value={password}
                  onFocusChange={(e) => setIsOpenPasswordPopover(e)}
                  onChange={(e) => setPassword(e.target.value)}
                  radius="lg"
                  classNames={{ input: "font-bold" }}
                  className=" font-bold"
                  type={isVisiblePassword ? "text" : "password"}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                    >
                      {isVisiblePassword ? (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                <motion.div
                  initial={{
                    scale: isOpenPasswordPopover ? 1 : 1.1,
                    filter: isOpenPasswordPopover ? "blur(0px)" : "blur(10px)",
                    opacity: isOpenPasswordPopover ? 1 : 0,
                    pointerEvents: isOpenPasswordPopover ? "auto" : "none",
                  }}
                  animate={{
                    scale: isOpenPasswordPopover ? 1 : 1.1,
                    filter: isOpenPasswordPopover ? "blur(0px)" : "blur(10px)",
                    opacity: isOpenPasswordPopover ? 1 : 0,
                    pointerEvents: isOpenPasswordPopover ? "auto" : "none",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className=" origin-center absolute z-50 bottom-[-110px]  left-0 right-0 text-start items-center mx-auto h-[6rem] w-full"
                >
                  <div className=" w-full h-full bg-white shadow-zinc-300  shadow-[0_0_20px_rgba(0,0,0,20)] rounded-2xl origin-top flex items-start justify-between p-3 flex-col text-xs">
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className={`flex items-center transition-colors font-bold  gap-x-2 ${
                          requirement.isValid
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        <div
                          className={` transition-colors w-[5px] h-[5px] ${
                            requirement.isValid ? "bg-green-400" : "bg-red-400"
                          } rounded-full`}
                        />
                        {requirement.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <Input
                size="sm"
                variant="flat"
                label="Potwierdź hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                radius="lg"
                classNames={{ input: "font-bold" }}
                className=" font-bold"
                type={isVisibleConfirmPassword ? "text" : "password"}
                endContent={
                  <button
                    type="button"
                    onClick={() =>
                      setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                    }
                  >
                    {isVisibleConfirmPassword ? (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </motion.div>
          </motion.div>
          <div className=" flex items-center font-bold justify-center mt-5 gap-x-3">
            <hr className=" w-full" />
            LUB
            <hr className=" w-full" />
          </div>
          <div className="flex gap-x-3 mt-5 items-center justify-center">
            <Button
              isIconOnly
              variant="light"
              radius="full"
              onPress={handleGoogleSignIn}
              startContent={
                <Image src="/google.svg" alt="Google" width={24} height={24} />
              }
              className=" font-bold text-base"
              size="md"
            />
          </div>
          <Button
            className=" w-full bg-blue-400 text-white font-bold text-lg mt-5"
            size="lg"
            onPress={handleLoginRegister}
          >
            {selected === "login" ? <p>Zaloguj</p> : <p>Zarejestruj</p>}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
