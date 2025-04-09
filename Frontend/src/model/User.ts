export type UserType = 'ADMIN' | 'CLIENT';

interface User {
    uuid: string;
    username: string;
    email: string;
    password: string;
    userType: UserType;
    name: string;
    age: number | null;
}

export default User;