"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { useUser } from "./store/user";
import { redirect, usePathname } from "next/navigation";
import { db } from "@/services/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useLoginSteps } from "./store/loginSteps";
import { AnimatePresence, motion } from "framer-motion";

interface AuthContextType {
  user: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from "react";
import { Button } from "@heroui/button";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useUser((state: any) => state.setUser);
  const [loading, setLoading] = useState(true);
  const setStep = useLoginSteps((state: any) => state.setStep);
  const [isReloadReady, setIsReloadReady] = useState(false);

  const pathanme = usePathname();

  const getUserDisplayName = async (uid: string) => {
    const ref = doc(db, "users", uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return docSnap.data().displayName;
    } else {
      console.log("No such document!");
    }
  };

  const getUserType = async (uid: string) => {
    const ref = doc(db, "users", uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().role);
      return docSnap.data().role;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setIsReloadReady(true);
      }, 3000);
    }
  }, [loading]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      auth.useDeviceLanguage();
      console.log("Auth state changed");

      if (!user) {
        console.log("User is signed out");
        setUser(null);
        setStep(1);
        setLoading(false);
        redirect("/login");
      }

      // Check email verification first
      if (!user.emailVerified && pathanme !== "/verify-email") {
        console.log("Email not verified, redirecting...");
        setLoading(false);
        redirect("/verify-email");
      }

      // Load user data only if email is verified
      const type = await getUserType(user.uid);
      await setUser({
        email: user.email,
        displayName:
          user.displayName === null
            ? await getUserDisplayName(user.uid)
            : user.displayName,
        uid: user.uid,
        role: type !== null && type,
      });

      console.log("User loaded");
      if (pathanme === "/verify-email" && user.emailVerified) {
        redirect("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: null }}>
      <div className=" w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <>
              <motion.img
                key={"loading"}
                exit={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                initial={{ opacity: 0, scale: 0.5 }}
                src="./logobiale2.png"
                className=" brightness-0"
              />
              <motion.div
                key={"reload"}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: isReloadReady ? 1 : 0,
                  scale: isReloadReady ? 1 : 0.5,
                  display: isReloadReady ? "block" : "none",
                }}
                className=" w-min absolute bottom-10"
              >
                <Button
                  radius="full"
                  size="lg"
                  onPress={() => {
                    window.location.reload();
                  }}
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 513.806 513.806"
                      width="20"
                      height="20"
                    >
                      <g>
                        <path d="M66.074,228.731C81.577,123.379,179.549,50.542,284.901,66.045c35.944,5.289,69.662,20.626,97.27,44.244l-24.853,24.853   c-8.33,8.332-8.328,21.84,0.005,30.17c3.999,3.998,9.423,6.245,15.078,6.246h97.835c11.782,0,21.333-9.551,21.333-21.333V52.39   c-0.003-11.782-9.556-21.331-21.338-21.329c-5.655,0.001-11.079,2.248-15.078,6.246L427.418,65.04   C321.658-29.235,159.497-19.925,65.222,85.835c-33.399,37.467-55.073,83.909-62.337,133.573   c-2.864,17.607,9.087,34.202,26.693,37.066c1.586,0.258,3.188,0.397,4.795,0.417C50.481,256.717,64.002,244.706,66.074,228.731z" />
                        <path d="M479.429,256.891c-16.108,0.174-29.629,12.185-31.701,28.16C432.225,390.403,334.253,463.24,228.901,447.738   c-35.944-5.289-69.662-20.626-97.27-44.244l24.853-24.853c8.33-8.332,8.328-21.84-0.005-30.17   c-3.999-3.998-9.423-6.245-15.078-6.246H43.568c-11.782,0-21.333,9.551-21.333,21.333v97.835   c0.003,11.782,9.556,21.331,21.338,21.329c5.655-0.001,11.079-2.248,15.078-6.246l27.733-27.733   c105.735,94.285,267.884,85.004,362.17-20.732c33.417-37.475,55.101-83.933,62.363-133.615   c2.876-17.605-9.064-34.208-26.668-37.084C482.655,257.051,481.044,256.91,479.429,256.891z" />
                      </g>
                    </svg>
                  }
                  className=" bg-zinc-100 font-extrabold text-xl border-2"
                >
                  Reconnet
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div
              key={"content"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
