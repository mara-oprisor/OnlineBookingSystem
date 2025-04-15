import {useState} from "react";
import * as React from "react";
import LoginService from "../service/LoginService.tsx";
import { useNavigate } from "react-router-dom"
import axios from "axios";

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
        setErrorMsg("");

        if (username === "") {
            setErrorMsg("Username is required!");
        }
        else if(password === "") {
            setErrorMsg("Password is required!");
        } else {
            try {
                const response = await loginService.login(username, password);

                if(response.success) {
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('role', response.role);
                    console.log("Login successful: ", response);

                    if(response.role == "CLIENT") {
                        navigate('/client');
                    } else {
                        navigate('/admin');
                    }
                } else {
                    setErrorMsg(response.errorMessage);
                }
            } catch(error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.error('Login failed:', error.response.data);
                    setErrorMsg(error.response.data.errorMessage);
                } else {
                    console.error('An unexpected error occurred:', error);
                    setErrorMsg('Failed to login. Please try again later.');
                }
            }
        }
    }

    function logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        navigate('/login');
    }

    return {
        username,
        handleUsernameChange,
        password,
        handlePasswordChange,
        errorMsg,
        handleLogin,
        logout
    }
}

export default useLogin;