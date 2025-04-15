interface LoginResponse {
    success: boolean;
    role: string;
    errorMessage: string;
    token: string;
}

export default LoginResponse;