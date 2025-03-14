"use client";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import {
  sendEmailVerification,
} from "firebase/auth";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [time, setTime] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev: number) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" w-full h-full flex justify-center items-center bg-white">
      <motion.div className=" relative w-[35rem] bg-white shadow-[0_0_10px_rgba(0,0,0,10)] shadow-zinc-300 rounded-[2.5rem] flex flex-col justify-between pt-10 items-center gap-y-5 p-5">
        <motion.div className=" flex flex-col items-center gap-y-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="50"
            height="50"
          >
            <path d="M19,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6A5.006,5.006,0,0,0,19,1ZM5,3H19a3,3,0,0,1,2.78,1.887l-7.658,7.659a3.007,3.007,0,0,1-4.244,0L2.22,4.887A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V7.5L8.464,13.96a5.007,5.007,0,0,0,7.072,0L22,7.5V18A3,3,0,0,1,19,21Z" />
          </svg>
          <h1 className=" font-extrabold text-3xl top-5">Check your inbox</h1>
          <p className=" text-lg text-zinc-400 font-bold mb-5 text-center px-10">
            We have sent a verification link to your email address. Please check
            your inbox and click on the link to verify your email address.
          </p>
        </motion.div>
        <div className="  w-full flex gap-x-5">
          <Button
            isDisabled={time > 0}
            onPress={async () => {
              setTime(30);
              await sendEmailVerification(auth.currentUser!);
            }}
            className={`  border-white active:!scale-100 w-full h-[4rem] font-bold bg-blue-400 text-white text-2xl rounded-3xl`}
          >
            {time > 0 ? `Resend in ${time}s` : "Resend"}
          </Button>
          <Button
            onPress={async () => {
              await auth.signOut();
            }}
            className={`  border-white active:!scale-100 w-full h-[4rem] font-bold bg-zinc-300 text-white text-2xl rounded-3xl`}
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
