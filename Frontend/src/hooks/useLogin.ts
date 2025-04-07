import {useState} from "react";
import * as React from "react";
import LoginService from "../service/LoginService.tsx";
import { useNavigate } from "react-router-dom"

function useLogin(){
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();

    const loginService = LoginService();

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        if (username === "") {
            setErrorMsg("Username is required!");
        }
        else if(password === "") {
            setErrorMsg("Password is required!");
        } else {
            try {
                const response = await loginService.login(username, password);

                if(response.success) {
                    if(response.role == "CLIENT") {
                        navigate('/client');
                    } else {
                        navigate('/admin');
                    }
                } else {
                    setErrorMsg(response.errorMessage);
                }
            } catch {
                setErrorMsg("An unexpected error occurred! Please try again!");
            }
        }
    }

    return {
        username,
        handleUsernameChange,
        password,
        handlePasswordChange,
        errorMsg,
        handleLogin
    }
}

export default useLogin;