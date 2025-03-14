"use client";
import React, { useEffect, useState, useRef } from "react";
import { useScroll } from "./store/scroll";
import { motion } from "framer-motion";
import { useDeviceStore } from "./store/device";
import { useSizeStore } from "./store/size";
import { useProfileStore } from "./store/profile";
import { Button } from "@heroui/button";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Obiad } from "@/app/components/danie";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const setScroll = useScroll((state) => state.setScroll);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isSmall = useSizeStore((state) => state.isSmall);
  const profileOpen = useProfileStore((state) => state.profileOpen);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  interface Danie {
    nazwa: string;
    opis: string;
    data?: any;
    skladniki?: string;
    przygotowanie?: string;
    kcal?: string;
  }

  const [danie, setDanie] = useState<Danie[]>([]);
  const [nazwaDania, setNazwaDania] = useState("");
  const [skladnikiDania, setSkladnikiDania] = useState("");
  const [przygotowanieDania, setPrzygotowanieDania] = useState("");
  const [kalorieDania, setKalorieDania] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "obiady"),
      (querySnapshot) => {
        const danieArray: Danie[] = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          danieArray.push({
            ...(doc.data() as Danie),
          });
        });
        setDanie(danieArray);
        console.log(danieArray);
      },
      (error) => {
        console.error("Error getting snapshot: ", error);
      }
    );

    return () => unsubscribe();
  }, []);
  console.log(danie);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setScroll(ref.current.scrollTop);
        console.log(ref.current.scrollTop);
      }
    };

    ref.current?.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  const dodajDanie = async () => {
    await addDoc(collection(db, "obiady"), {
      nazwa: nazwaDania,
      skladniki: skladnikiDania,
      przygotowanie: przygotowanieDania,
      kcal: kalorieDania,
      data: new Date(),
    });
    onOpenChange();
  };

  const chartData = {
    labels: danie.map((obiad) => obiad.nazwa),
    datasets: [
      {
        label: "Kalorie",
        data: danie.map((obiad) => obiad.kcal),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Kalorie posiłków",
      },
    },
  };
  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 1.1,
        paddingLeft: isMobile || isSmall ? "2rem" : "22rem",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      animate={{
        opacity: 1,
        scale: 1,
        paddingLeft: isMobile || isSmall ? "2rem" : "22rem",
        paddingBottom: "5rem",
      }}
      className={` ${
        profileOpen ? "overflow-hidden" : "overflow-y-auto"
      } pt-[5rem] lg:px-[2rem] px-[1rem] flex-row flex flex-wrap  w-full h-full z-[2] gap-5 `}
    >
      <div
        className={`flex flex-col w-full md:w-[25rem] h-[25rem] bg-gray-200 rounded-2xl gap-5 px-4 dark:bg-zinc-500`}
      >
        <div className="flex flex-row justify-between items-center mt-2 dark:bg-zinc-500">
          <h1 className="text-start font-bold text-xl ">Ostatnie posiłki</h1>
          <div className="flex flex-row  items-center">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="rounded-full border-none"
              onPress={onOpen}
            >
              <Image
                src={"/add.png"}
                alt="Add"
                width={40}
                height={40}
                className="p-2"
              />
            </Button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll dark:bg-zinc-500">
          {danie &&
            danie.map((obiad, index) => (
              <div key={index}>
                <Obiad
                  nazwa={obiad?.nazwa || ""}
                  kcal={obiad?.kcal || ""}
                  data={obiad?.data}
                  skladniki={obiad?.skladniki}
                  przygotowanie={obiad?.przygotowanie}
                />
              </div>
            ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Dodaj posiłek
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nazwa dania"
                  labelPlacement="inside"
                  type="text"
                  variant={"faded"}
                  onChange={(e) => setNazwaDania(e.target.value)}
                />
                <Input
                  label="Ilość kalorii dania"
                  labelPlacement="inside"
                  type="text"
                  variant={"faded"}
                  onChange={(e) => setKalorieDania(e.target.value)}
                />
                <Input
                  label="Składniki dania"
                  labelPlacement="inside"
                  type="text"
                  variant={"faded"}
                  onChange={(e) => setSkladnikiDania(e.target.value)}
                />
                <Input
                  label="Sposób przygotowania"
                  labelPlacement="inside"
                  type="text"
                  variant={"faded"}
                  onChange={(e) => setPrzygotowanieDania(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Zamknij
                </Button>
                <Button color="primary" onPress={dodajDanie}>
                  Dodaj
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="w-[30rem] h-[25rem] bg-gray-200 rounded-2xl px-4 dark:bg-zinc-500 dark:text-white">
        <div className="flex flex-row justify-between items-center mt-2 dark:text-white">
          <h1 className="text-start font-bold text-xl dark:text-white">Statystyki</h1>
        </div>
        <div className=" flex flex-col dark:text-white">
          <h3>Średnia kaloryczna ostatnich posiłków: 1700kcal</h3>
          <h3 className="py-3 dark:text-white">Spożyte wartości odżywcze:</h3>
          <p className="text-sm dark:text-white">Tłuszcze:65</p>
          <p className="text-sm dark:text-white">Białko:35g</p>
          <p className="text-sm dark:text-white">Węglowodany:3g</p>
          <div className="w-full h-full dark:text-white">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
