"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDeviceStore } from "@/app/store/device";
import { useSizeStore } from "@/app/store/size";
import { useProfileStore } from "@/app/store/profile";
import { Button } from "@heroui/react";
import { generateChatResponse } from "@/services/gemini";
import { useUser } from "../store/user";
import { useChatStore } from "../store/historyChat";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  model?: string;
  timestamp: Date;
}

const ThinkingDots = () => {
  return (
    <div className="flex items-center justify-between space-x-1 p-3 rounded-2xl bg-white border ml-2 border-zinc-200 shadow-[0_0_10px_rgba(0,0,0,0)] shadow-zinc-200 max-w-[40%]">
      <div className=" flex items-center gap-x-2">
        <div className="cursor-default bg-white flex items-center justify-center size-8 text-xs font-bold rounded-full text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width={26}
            height={26}
            fill="black"
          >
            <path d="M19.134,11.569c0-.376-.211-.721-.547-.892-.86-.438-1.781-.841-2.813-1.233-1.706-.654-2.949-1.916-3.595-3.645-.387-1.049-.785-1.983-1.216-2.855-.169-.34-.517-.556-.896-.556s-.729,.216-.896,.557c-.43,.869-.827,1.803-1.214,2.85-.646,1.732-1.89,2.994-3.593,3.647-1.038,.395-1.96,.798-2.817,1.235-.335,.17-.546,.515-.546,.891s.211,.721,.547,.892c.862,.438,1.783,.842,2.813,1.232,1.706,.654,2.949,1.916,3.595,3.646,.389,1.053,.786,1.985,1.215,2.854,.169,.341,.516,.557,.896,.557s.728-.216,.896-.557c.431-.869,.828-1.803,1.214-2.851,.647-1.732,1.892-2.994,3.593-3.647,1.034-.392,1.955-.795,2.817-1.233,.336-.171,.547-.515,.547-.892Z" />
            <path d="M17.096,6.542c.255,.13,.506,.237,.753,.331,.207,.08,.352,.228,.43,.435,.092,.253,.197,.505,.324,.763,.167,.342,.515,.56,.896,.56h.002c.38,0,.728-.216,.896-.557,.127-.257,.231-.51,.324-.761,.08-.212,.225-.36,.428-.438,.251-.095,.501-.202,.756-.332,.336-.17,.547-.516,.547-.892s-.212-.721-.548-.891c-.254-.128-.504-.235-.752-.33-.206-.079-.351-.227-.43-.437-.094-.253-.198-.506-.326-.764-.168-.34-.516-.556-.896-.556h-.002c-.381,0-.728,.217-.896,.559-.126,.257-.231,.51-.322,.758-.08,.212-.225,.36-.428,.438-.252,.096-.502,.202-.757,.332-.336,.17-.547,.515-.547,.891s.211,.721,.547,.891Z" />
            <path d="M22.453,17.185c-.317-.161-.63-.295-.938-.411-.339-.13-.586-.382-.713-.724-.117-.316-.248-.632-.406-.952-.169-.341-.517-.557-.896-.557h0c-.381,0-.729,.217-.896,.559-.157,.32-.288,.635-.402,.945-.13,.347-.377,.599-.711,.727-.312,.118-.626,.252-.942,.414-.335,.171-.546,.515-.546,.891s.211,.72,.546,.891c.316,.161,.628,.294,.939,.413,.337,.129,.584,.38,.712,.723,.116,.315,.247,.631,.405,.95,.168,.341,.515,.557,.896,.558h0c.38,0,.727-.215,.896-.556,.159-.32,.29-.636,.406-.949,.128-.346,.375-.597,.712-.726,.312-.119,.623-.251,.939-.412,.336-.171,.547-.516,.547-.892s-.211-.721-.547-.892Z" />
          </svg>
        </div>
        <span className="text-sm font-extrabold text-zinc-500">
          {"FoodGenius"}
        </span>
      </div>
      <div className="ml-2 flex items-end">
        <motion.div
          className="w-2 h-2 bg-zinc-300 rounded-full mr-1"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-zinc-300 rounded-full mr-1"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-zinc-300 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
        />
      </div>
    </div>
  );
};

export default function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isSmall = useSizeStore((state) => state.isSmall);
  const profileOpen = useProfileStore((state) => state.profileOpen);
  const [daytime, setDaytime] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.addMessage);
  const user = useUser((state: any) => state.user);
  const [conversationPhase, setConversationPhase] = useState<
    "initial" | "questioning" | "recipe"
  >("initial");

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
      setDaytime("śniadanie");
    } else if (hours >= 12 && hours < 18) {
      setDaytime("obiad");
    } else {
      setDaytime("kolację");
    }
  }, []);

  useEffect(() => {
    // Wykonaj tylko jeśli znamy już porę dnia i nie ma jeszcze żadnych wiadomości
    if (daytime && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `ai-welcome-${Date.now()}`,
        content: `Cześć! Jestem FoodGenius, Twój asystent kulinarny. 😊
        
Na co masz ochotę na ${daytime}? Mogę pomóc Ci przygotować coś pysznego, zdrowego i dostosowanego do Twoich preferencji.

Powiedz mi, co lubisz jeść lub jakie składniki masz dostępne, a stworzę przepis specjalnie dla Ciebie!`,
        role: "ai",
        timestamp: new Date(),
      };

      // Dodaj wiadomość powitalną do historii
      setMessages(welcomeMessage);
      setConversationPhase("questioning");
    }
  }, [daytime, messages.length, setMessages]);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;

    // Dodaj wiadomość użytkownika do historii
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: prompt,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(userMessage);
    setLoading(true);

    try {
      // Przygotuj wiadomości do wysłania - FILTRUJĘ wiadomość powitalną od AI
      const chatMessages = messages
        .filter((msg) => !msg.id.includes("ai-welcome"))
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          content: msg.content,
        })) as { role: "user" | "model" | "system"; content: string }[];

      // Dodaj systemową instrukcję - zmiana let na const zgodnie z sugestią ESLint
      const systemInstruction = `Cześć! Jestem FoodGenius, Twój asystent kulinarny. 😊
        Na co masz ochotę na ${daytime}? Mogę pomóc Ci przygotować coś pysznego, zdrowego i dostosowanego do Twoich preferencji. 🍽️
Powiedz mi, co lubisz jeść lub jakie składniki masz dostępne, a stworzę przepis specjalnie dla Ciebie! 📜,`;

      // Dodaj nową wiadomość użytkownika jako PIERWSZĄ jeśli chatMessages jest puste
      if (chatMessages.length === 0) {
        chatMessages.push({
          role: "user",
          content: prompt,
        });
      } else {
        // W przeciwnym razie dodaj na końcu
        chatMessages.push({
          role: "user",
          content: prompt,
        });
      }

      // Ustal jak powinna zachowywać się AI w zależności od fazy rozmowy
      let aiPrompt = "";

      // Sprawdź ile pytań już zadano (nie licząc wiadomości powitalnej)
      const aiResponsesCount = messages.filter(
        (m) => m.role === "ai" && !m.id.includes("ai-welcome")
      ).length;

      if (aiResponsesCount === 0) {
        // Pierwszy prompt użytkownika po powitaniu
        aiPrompt = `${systemInstruction}\nUżytkownik chce: ${prompt}\nZadaj pytanie o preferencje kulinarne, dostępne składniki, alergeny lub czas przygotowania.`;
      } else if (conversationPhase === "questioning") {
        // Sprawdź, czy to już czas na przepis
        if (aiResponsesCount >= 3) {
          setConversationPhase("recipe");
          aiPrompt = `${systemInstruction}\nBazując na całej rozmowie, przedstaw kompletny przepis na ${daytime}. Format: lista składników, a potem kroki.`;
        } else {
          aiPrompt = `${systemInstruction}\nKontynuuj zadawanie pytań o preferencje, składniki lub czas przygotowania. Jedno pytanie na raz.`;
        }
      }

      // Wywołaj API z pełnym kontekstem rozmowy
      const result = await generateChatResponse(
        chatMessages,
        "gemini-1.5-flash",
        0.7,
        1024,
        aiPrompt
      );

      // Dodaj odpowiedź AI do historii
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: result,
        role: "ai",
        timestamp: new Date(),
      };

      setMessages(aiMessage);
    } catch (error) {
      console.error("Error generating recipe:", error);

      // Dodaj komunikat o błędzie jako wiadomość AI
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          "Przepraszam, wystąpił błąd podczas generowania przepisu. Spróbuj ponownie później.",
        role: "ai",
        timestamp: new Date(),
      };

      setMessages(errorMessage);
    } finally {
      setLoading(false);
      setPrompt(""); // Wyczyść pole wprowadzania po wysłaniu
    }
  };

  // Obsługa klawisza Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getFirstLetters = (displayName: string) => {
    if (!displayName) return "";
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("");
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
      className={`${
        profileOpen ? "overflow-hidden" : "overflow-y-auto"
      } pt-[4.5rem] lg:px-[2rem] px-[1rem] flex-col flex items-start justify-start w-full min-h-screen max-h-screen pb-[6rem] z-[2]`}
    >
      <div className="w-full flex-1 flex flex-col items-center overflow-y-auto pb-20">
        {messages.length > 0 && (
          <div className=" mb-6 w-full space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-zinc-200 ml-auto max-w-[40%] dark:bg-zinc-500 dark:text-white"
                    : "bg-white border ml-2 border-zinc-200 shadow-[0_0_10px_rgba(0,0,0,0)] shadow-zinc-200 max-w-[40%]  dark:shadow-zinc-500 dark:text-white dark:bg-zinc-600 dark:border-zinc-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === "user" ? (
                    <div className=" flex justify-between w-full">
                      <div className="mr-auto">
                        <span className="text-xs text-zinc-400 font-bold">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="cursor-default bg-zinc-400 flex  items-center justify-center  size-8 text-xs font-bold rounded-full text-white">
                        {getFirstLetters(user?.displayName).toLocaleUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="cursor-default bg-white flex  items-center justify-center  size-8 text-xs font-bold rounded-full text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Layer_1"
                          data-name="Layer 1"
                          viewBox="0 0 24 24"
                          width={26}
                          height={26}
                          fill="black"
                        >
                          <path d="M19.134,11.569c0-.376-.211-.721-.547-.892-.86-.438-1.781-.841-2.813-1.233-1.706-.654-2.949-1.916-3.595-3.645-.387-1.049-.785-1.983-1.216-2.855-.169-.34-.517-.556-.896-.556s-.729,.216-.896,.557c-.43,.869-.827,1.803-1.214,2.85-.646,1.732-1.89,2.994-3.593,3.647-1.038,.395-1.96,.798-2.817,1.235-.335,.17-.546,.515-.546,.891s.211,.721,.547,.892c.862,.438,1.783,.842,2.813,1.232,1.706,.654,2.949,1.916,3.595,3.646,.389,1.053,.786,1.985,1.215,2.854,.169,.341,.516,.557,.896,.557s.728-.216,.896-.557c.431-.869,.828-1.803,1.214-2.851,.647-1.732,1.892-2.994,3.593-3.647,1.034-.392,1.955-.795,2.817-1.233,.336-.171,.547-.515,.547-.892Z" />
                          <path d="M17.096,6.542c.255,.13,.506,.237,.753,.331,.207,.08,.352,.228,.43,.435,.092,.253,.197,.505,.324,.763,.167,.342,.515,.56,.896,.56h.002c.38,0,.728-.216,.896-.557,.127-.257,.231-.51,.324-.761,.08-.212,.225-.36,.428-.438,.251-.095,.501-.202,.756-.332,.336-.17,.547-.516,.547-.892s-.212-.721-.548-.891c-.254-.128-.504-.235-.752-.33-.206-.079-.351-.227-.43-.437-.094-.253-.198-.506-.326-.764-.168-.34-.516-.556-.896-.556h-.002c-.381,0-.728,.217-.896,.559-.126,.257-.231,.51-.322,.758-.08,.212-.225,.36-.428,.438-.252,.096-.502,.202-.757,.332-.336,.17-.547,.515-.547,.891s.211,.721,.547,.891Z" />
                          <path d="M22.453,17.185c-.317-.161-.63-.295-.938-.411-.339-.13-.586-.382-.713-.724-.117-.316-.248-.632-.406-.952-.169-.341-.517-.557-.896-.557h0c-.381,0-.729,.217-.896,.559-.157,.32-.288,.635-.402,.945-.13,.347-.377,.599-.711,.727-.312,.118-.626,.252-.942,.414-.335,.171-.546,.515-.546,.891s.211,.72,.546,.891c.316,.161,.628,.294,.939,.413,.337,.129,.584,.38,.712,.723,.116,.315,.247,.631,.405,.95,.168,.341,.515,.557,.896,.558h0c.38,0,.727-.215,.896-.556,.159-.32,.29-.636,.406-.949,.128-.346,.375-.597,.712-.726,.312-.119,.623-.251,.939-.412,.336-.171,.547-.516,.547-.892s-.211-.721-.547-.892Z" />
                        </svg>
                      </div>
                      <span className="text-sm font-extrabold text-zinc-500">
                        {"FoodGenius"}
                      </span>
                      <div className="ml-auto">
                        <span className="text-xs text-zinc-400 font-bold">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="whitespace-pre-line font-bold">
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <ThinkingDots />}
          </div>
        )}
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 gap-x-5 w-full flex backdrop-blur-xl bg-white/10 p-4 pb-6 items-center justify-center"
        style={{
          paddingLeft: isMobile || isSmall ? "2rem" : "calc(22rem + 2rem)",
        }}
      >
        <Button
          isIconOnly
          isDisabled={loading || messages.length === 0}
          onPress={() => {
            useChatStore.getState().clearMessages();
            setConversationPhase("initial");
          }}
          className="bg-zinc-100 border-2 border-zinc-300 rounded-3xl size-[3.5rem] dark:bg-zinc-500 dark:border-zinc-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#3f3f46"
          >
            <path d="M22.987,5.452c-.028-.177-.312-1.767-1.464-2.928-1.157-1.132-2.753-1.412-2.931-1.44-.237-.039-.479,.011-.682,.137-.071,.044-1.114,.697-3.173,2.438,1.059,.374,2.428,1.023,3.538,2.109,1.114,1.09,1.78,2.431,2.162,3.471,1.72-2.01,2.367-3.028,2.41-3.098,.128-.205,.178-.45,.14-.689Z" />
            <path d="M12.95,5.223c-1.073,.968-2.322,2.144-3.752,3.564C3.135,14.807,1.545,17.214,1.48,17.313c-.091,.14-.146,.301-.159,.467l-.319,4.071c-.022,.292,.083,.578,.29,.785,.188,.188,.443,.293,.708,.293,.025,0,.051,0,.077-.003l4.101-.316c.165-.013,.324-.066,.463-.155,.1-.064,2.523-1.643,8.585-7.662,1.462-1.452,2.668-2.716,3.655-3.797-.151-.649-.678-2.501-2.005-3.798-1.346-1.317-3.283-1.833-3.927-1.975Z" />
          </svg>
        </Button>
        <div className="w-[40rem] h-[4rem] z-10 bg-zinc-300 rounded-3xl flex p-4 items-center justify-between dark:bg-zinc-500 dark:border-zinc-600 dark:text-white">
          <input
            type="text"
            value={prompt}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Opisz co chcesz przygotować na ${daytime}`}
            className="w-full h-auto bg-transparent text-lg font-bold placeholder:text-white outline-none dark:text-white dark:bg-transparent dark:placeholder-zinc-300" 
          />
          <Button
            isLoading={loading}
            onPress={handleSubmit}
            size="sm"
            isDisabled={!prompt.trim() || loading}
            isIconOnly
            className="bg-white rounded-full p-2 dark:bg-zinc-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="black"
            >
              <path d="m.172,3.708C-.216,2.646.076,1.47.917.713,1.756-.041,2.951-.211,3.965.282l18.09,8.444c.97.454,1.664,1.283,1.945,2.273H4.048L.229,3.835c-.021-.041-.04-.084-.057-.127Zm3.89,9.292L.309,20.175c-.021.04-.039.08-.054.122-.387,1.063-.092,2.237.749,2.993.521.467,1.179.708,1.841.708.409,0,.819-.092,1.201-.279l18.011-8.438c.973-.456,1.666-1.288,1.945-2.28H4.062Z" />
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
