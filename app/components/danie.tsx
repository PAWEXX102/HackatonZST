"use client";
import { Divider } from "@heroui/divider";
import React, { useState } from "react";
import Image from "next/image";

interface Poprawa {
  nazwa: string;
  kcal: string;
  data?: any;
  skladniki?: string;
  przygotowanie?: string;
}

export const Obiad: React.FC<Poprawa> = (posilek) => {
  const [visible, setVisible] = useState(false);
  return (
    <div onClick={() => setVisible(!visible)} className="cursor-pointer">
      <div className="flex flex-row justify-between items-center ">
        <h1 className="text-sm font-bold">{posilek?.nazwa}</h1>
        <p className="text-[10px] font-thick">
          {posilek?.data
            ? new Date(posilek.data.toDate()).toLocaleDateString()
            : ""}
        </p>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm">{posilek?.kcal} kcal</p>
        <Image
          src={"/down-arrow.png"}
          alt="arrow-down"
          width={20}
          height={20}
          className={`${visible ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      <Divider className="my-2 bg-gray-300" />
      <div
        className={`${
          visible ? "block" : "hidden"
        } flex flex-col w-full h-full overflow-y-scroll`}
      >
        <h4 className="text-sm font-extrabold">Składniki:</h4>
        <p className="text-[13px]">{posilek?.skladniki}</p>
        <h3 className="font-extrabold text-sm">Przygotowanie:</h3>
        <p className="text-[13px]">{posilek?.przygotowanie}</p>
      </div>
    </div>
  );
};
