interface Token {
    iss: string;
    iat: number;
    exp: number;
    userId: string;
    role: string
}

export default Token;