import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import {WEBSOCKET_ENDPOINT} from "../constants/api.ts";

function useReminders() {
    const userId = sessionStorage.getItem("uuid");
    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS(WEBSOCKET_ENDPOINT);
        const stomp = new StompClient({
            webSocketFactory: () => socket,
            debug: (m) => console.debug("[STOMP]", m),
            onConnect: () => {
                console.debug("[STOMP] connected — now subscribing");
                stomp.subscribe(`/topic/reminders/${userId}`, (msg) => {
                    console.debug("[STOMP] got message", msg.body);
                    showToast(msg.body);
                });
            }
        });

        stomp.activate();
        return () => { stomp.deactivate(); };
    }, [userId]);
}

function showToast(message: string) {
    const root = document.getElementById("reminder-toast-root");
    if (!root) return;
    const div = document.createElement("div");
    div.innerText = message;
    div.className = "reminder-toast";
    root.append(div);
    setTimeout(() => {
        div.remove();
    }, 60_000);
}

export default useReminders;
