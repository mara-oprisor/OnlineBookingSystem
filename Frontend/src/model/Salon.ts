interface Salon {
    uuid: string;
    name: string;
    phoneNumber: string;
    favoriteFor?: { uuid: string }[];
}

export default Salon;