import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

export const generateChatResponse = async (
  messages: ChatMessage[],
  modelName = "gemini-1.5-flash",
  temperature = 0.7,
  maxOutputTokens = 1024,
  systemInstruction?: string
) => {
  try {
    // Sprawdź, czy mamy jakieś wiadomości i czy pierwsza jest od użytkownika
    if (messages.length === 0) {
      throw new Error("No messages provided");
    }

    if (messages[0].role !== "user") {
      // Jeśli pierwsza wiadomość nie jest od użytkownika, dodaj sztuczną
      messages.unshift({
        role: "user",
        content: "Pomóż mi z przepisem kulinarnym.",
      });
    }

    // Wybierz model
    const selectedModel = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature,
        maxOutputTokens,
        topP: 0.8,
        topK: 40,
      },
    });

    // Przygotuj historię konwersacji w formacie akceptowanym przez API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // Utwórz chat z historią lub bez, jeśli jest tylko jedna wiadomość
    const chat = selectedModel.startChat({
      history:
        formattedMessages.length > 1 ? formattedMessages.slice(0, -1) : [],
    });

    // Przygotuj wiadomość do wysłania
    let messageToSend =
      formattedMessages[formattedMessages.length - 1].parts[0].text;

    // Dodaj instrukcję systemową, jeśli istnieje
    if (systemInstruction) {
      messageToSend = `${systemInstruction}\n\n${messageToSend}`;
    }

    // Wyślij wiadomość i pobierz odpowiedź
    const result = await chat.sendMessage(messageToSend);
    return result.response.text();
  } catch (error) {
    console.error("Error with chat response:", error);
    throw error;
  }
};

// Funkcja do sprawdzenia pozostałego limitu zapytań (przykładowa implementacja)
export const checkRemainingQuota = async () => {
  try {
    // Tu możesz dodać logikę do sprawdzenia pozostałego limitu zapytań
    // Wymaga integracji z API Google Cloud lub własnej logiki śledzenia
    return {
      dailyRemaining: "Nieznane", // W rzeczywistej implementacji: liczba pozostałych zapytań
      monthlyUsage: "Nieznane", // W rzeczywistej implementacji: procent wykorzystanego limitu
    };
  } catch (error) {
    console.error("Error checking quota:", error);
    return { error: "Nie udało się sprawdzić limitu" };
  }
};
