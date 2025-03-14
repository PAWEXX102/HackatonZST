import { doc, getDoc } from "@firebase/firestore";
import { db } from "@/services/firebase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUser } from "../store/user";

export default function Chips({
  index,
  filter,
  selectedFilter,
  handleFilter,
}: {
  index: number;
  filter: string;
  selectedFilter: string;
  handleFilter: (filter: string) => void;
}) {
  const user = useUser((state: any) => state.user);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const loadChip = async () => {
      console.log("LOAD CHIP", filter);
      if (user && filter !== "") {
        if (user.role === "Teacher") {
          console.log("TEACHER", filter);
          const ref = doc(db, "classes", filter);
          const docSnap = await getDoc(ref);
          const data = docSnap.data();
          console.log(data);
          console.log("SSSSSSSSSSSSSSSSSSS");
          if (data) {
            setTitle(data.title);
          }
        } else {
          setTitle("Tests");
        }
      }
    };
    loadChip();
  }, []);
  return (
    <button
      key={index}
      onClick={() => handleFilter(filter)}
      className={` ${
        selectedFilter === filter
          ? " bg-blue-50  border-blue-400 pr-1"
          : ` border-zinc-300 bg-zinc-50 pr-2`
      } border w-max flex gap-x-2 items-center transition-all pl-4 rounded-xl`}
    >
      <h1
        className={` ${
          selectedFilter === filter ? "text-blue-400" : "text-black"
        } font-bold transition-all`}
      >
        {title}
      </h1>
      <motion.svg
        initial={{
          scale: 0,
          opacity: 0,
          width: 0,
        }}
        animate={{
          scale: selectedFilter === filter ? 1 : 0,
          opacity: selectedFilter === filter ? 1 : 0,
          width: selectedFilter === filter ? 15 : 0,
        }}
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        data-name="Layer 1"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="#60a5fa"
      >
        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm3.707,14.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-2.293,2.293,2.293,2.293Z" />
      </motion.svg>
    </button>
  );
}
