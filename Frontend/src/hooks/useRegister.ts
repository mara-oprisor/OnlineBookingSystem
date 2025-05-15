import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import User from "../model/User.ts";
import RegisterService from "../service/RegisterService.tsx";

function useRegister() {
    const [username, setUsername] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [userType, setUserType] = useState<"CLIENT"|"ADMIN">("CLIENT");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();

    const registerService = RegisterService();

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePassword1Change(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword1(event.target.value);
    }

    function handlePassword2Change(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword2(event.target.value);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleUserTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setUserType(event.target.value as "CLIENT" | "ADMIN");
    }

    function parseErrorMessage(errorMessage: string): string {
        try {
            const errors = JSON.parse(errorMessage);
            return Object.values(errors).join("\n");
        } catch {
            return errorMessage;
        }
    }

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault();
        setErrorMsg("");

        if (!username || !email || !password1 || !password2) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }
        if (password1 !== password2) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        const user: User = {
            uuid: "",
            username: username,
            email: email,
            password: password1,
            userType: userType,
            age: null,
            name: ""
        };

        try {
            const created: User = await registerService.registerUser(user);
            console.log("Registered!", created);
            navigate("/auth");
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error while registering:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            setErrorMsg(`Failed to register:\n${detailedMessage}`);
            throw error;
        }
    }

    return {
        username, email, password1, password2, userType, errorMsg,
        handleUsernameChange,
        handleEmailChange,
        handlePassword1Change,
        handlePassword2Change,
        handleUserTypeChange,
        handleRegister
    };
}

export default useRegister;
