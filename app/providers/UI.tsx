"use client";

import * as React from "react";

import {HeroUIProvider} from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useDeviceStore } from "../store/device";
import { useOrientation } from "../store/orientation";
import { useEffect } from "react";

export default function ProviderUI({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const setIsMobile = useDeviceStore((state: any) => state.setIsMobile);
  const setOrientation = useOrientation((state: any) => state.setOrientation);

  useEffect(() => {
    // Funkcja do sprawdzania, czy urządzenie jest mobilne
    const checkIfMobile = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        // Próg szerokości, poniżej którego urządzenie jest uważane za mobilne
        const mobileThreshold = 1024; // Możesz dostosować tę wartość
        setIsMobile(width < mobileThreshold);
        console.log("isMobile", width < mobileThreshold);
      }
    };

    // Funkcja do sprawdzania orientacji urządzenia
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        const orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
        setOrientation(orientation);
        console.log("orientation", orientation);
      }
    };

    // Sprawdzenie typu urządzenia i orientacji po załadowaniu komponentu
    checkIfMobile();
    checkOrientation();

    // Dodanie nasłuchiwania na zmiany rozmiaru okna i orientacji
    window.addEventListener("resize", checkIfMobile);
    window.addEventListener("resize", checkOrientation);

    // Czyszczenie nasłuchiwania przy odmontowaniu komponentu
    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  return (
    <HeroUIProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
