import React from "react";
import useReminders from "../hooks/useReminders";

function ReminderProvider({ children }: { children: React.ReactNode }) {
    useReminders();
    return (
        <>
            {children}
            <div
                id="reminder-toast-root"
                style={{
                    position: "fixed",
                    top: "4rem",
                    right: "1rem",
                    zIndex: 2000,
                }}
            />
        </>
    );
}

export default ReminderProvider;
