import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { motion } from "framer-motion";

export default function TestPrewiev({
  test,
  index,
  filter,
}: {
  test: string;
  filter: string;
  index: number;
}) {
  const router = useRouter();
  const [testInfo, setTestInfo] = useState({
    title: "",
    to: "",
    toDB: "",
    memberAmount: 0,
  });

  useEffect(() => {
    if (!test) return;
    const loadTestPrewiev = async () => {
      console.log("LOAD TEST PREWIEV", test);
      const ref = doc(db, "tests", test);
      const docSnap = await getDoc(ref);
      const data = docSnap.data();
      const classRef = doc(db, "classes", data?.to);
      const classDocSnap = await getDoc(classRef);
      const classData = classDocSnap.data();
      if (data) {
        setTestInfo({
          title: data.title,
          to: classData?.title,
          toDB: data.to,
          memberAmount: classData?.members.length,
        });
      }
    };
    loadTestPrewiev();
  }, []);


  if (filter !== "" && testInfo.toDB !== filter) {
    return null;
  }

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: filter === "" || testInfo.toDB === filter ? 1 : 0,
        scale: filter === "" || testInfo.toDB === filter ? 1 : 0,
      }}
      key={index}
      onClick={() => router.push(`/tests/${test}`)}
      className=" bg-purple-300 flex group relative hover:scale-105 cursor-pointer items-center justify-end flex-col text-center h-[12rem] rounded-3xl pb-3 px-5 w-[20rem] [&:not(:has(button:active))]:active:scale-95"
    >
      <h1 className=" group-hover:opacity-100 absolute text-6xl transition-all group-hover:scale-110  opacity-30 font-extrabold top-0 text-white h-max bottom-0 my-auto">
        {testInfo.to}
      </h1>
      <Dropdown
        placement="bottom-end"
        size="sm"
        classNames={{
          content: " rounded-3xl  p-0 origin-top-right ",
          backdrop: "bg-white/10 backdrop-blur-xl",
        }}
        motionProps={{
          initial: {
            scale: 0.5,
            opacity: 0,
          },
          animate: {
            scale: 1,
            opacity: 1,
          },
          exit: {
            scale: 0,
            opacity: 0,
          },
        }}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            className=" absolute top-3 right-3 group-hover:opacity-100 opacity-0  bg-transparent"
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
              fill="#fff"
            >
              <g>
                <path d="M480,224H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
                <path d="M32,138.667h448c17.673,0,32-14.327,32-32s-14.327-32-32-32H32c-17.673,0-32,14.327-32,32S14.327,138.667,32,138.667z" />
                <path d="M480,373.333H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,373.333,480,373.333z" />
              </g>
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          closeOnSelect={false}
          classNames={{
            base: [
              `p-0 rounded-3xl border-zinc-200 bg-opacity-0  data-[hover=true]:text-white`,
            ],
            list: "gap-0",
          }}
        >
          <DropdownItem
            classNames={{
              base: " rounded-none border-zinc-200 data-[hover=true]:bg-white data-[hover=true]:text-blue-400 py-3 pl-5 opacity-100 text-black",
              title: "font-extrabold text-lg flex gap-x-2 items-center",
            }}
            key={"Change Title"}
          >
            Change Title
          </DropdownItem>
          <DropdownItem
            classNames={{
              base: " rounded-none border-zinc-200 border-t data-[hover=true]:bg-white data-[hover=true]:text-blue-400 py-3 pl-5 opacity-100 text-black",
              title: "font-extrabold text-lg flex gap-x-2 items-center",
            }}
            key={"See Results"}
          >
            See Results
          </DropdownItem>
          <DropdownItem
            closeOnSelect={false}
            classNames={{
              base: " rounded-none border-zinc-200 border-t data-[hover=true]:bg-red-400 data-[hover=true]:text-white py-3 pl-5 opacity-100 text-red-400",
              title: "font-extrabold text-lg flex gap-x-2 items-center",
            }}
            key={"Delete Test"}
          >
            Delete Test
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className=" group-hover:scale-110 group-hover:opacity-0 transition-all flex w-full justify-between items-center">
        <h1 className=" font-bold text-2xl text-white truncate max-w-[70%]">
          {testInfo.title}
        </h1>
        <div className=" flex gap-x-2 items-center">
          <h1 className=" font-extrabold text-xl text-white">
            {testInfo.memberAmount}
          </h1>
          <svg
            id="Layer_1"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            fill="#fff"
          >
            <path d="m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm6.5 11h-13a1 1 0 0 1 -1-1v-.5a7.5 7.5 0 0 1 15 0v.5a1 1 0 0 1 -1 1zm3.5-15a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm-1.421 2.021a6.825 6.825 0 0 0 -4.67 2.831 9.537 9.537 0 0 1 4.914 5.148h6.677a1 1 0 0 0 1-1v-.038a7.008 7.008 0 0 0 -7.921-6.941z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
