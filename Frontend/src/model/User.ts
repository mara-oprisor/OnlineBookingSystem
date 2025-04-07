export type UserType = 'ADMIN' | 'CLIENT';
export type Gender = 'MALE' | 'FEMALE';

interface User {
    uuid: string;
    username: string;
    email: string;
    password: string;
    type: UserType;
    name: string;
    age: number | null;
    gender: Gender | null;
}

export default User;