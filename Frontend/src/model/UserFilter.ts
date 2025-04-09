interface UserFilter {
    username?: string;
    email?: string;
    userType?: "ADMIN" | "CLIENT";
}

export default UserFilter;