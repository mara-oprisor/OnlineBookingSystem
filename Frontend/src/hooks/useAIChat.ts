import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { AI_CHAT_ENDPOINT } from "../constants/api";

export interface ChatMessage {
    role: "assistant" | "user";
    text: string;
}

function useAIChat() {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "assistant", text: t("aiChat.initialMessage") }
    ]);
    const [draft, setDraft] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    useEffect(() => {
        setMessages(msgs => {
            if (msgs.length === 0) return msgs;
            return [{ role: "assistant", text: t("aiChat.initialMessage") }, ...msgs.slice(1)];
        });
    }, [i18n.language]);

    async function sendMessage() {
        const text = draft.trim();
        if (!text) return;

        setMessages(m => [...m, { role: "user", text }]);
        setDraft("");

        try {
            const res = await axios.post(AI_CHAT_ENDPOINT, text, {
                headers: { "Content-Type": "text/plain" }
            });
            setMessages(m => [...m, { role: "assistant", text: res.data }]);
        } catch {
            setMessages(m => [
                ...m,
                {
                    role: "assistant",
                    text: t("aiChat.errorFallback")
                }
            ]);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return { messages, draft, setDraft, scrollRef, sendMessage, handleKeyDown };
}

export default useAIChat;
