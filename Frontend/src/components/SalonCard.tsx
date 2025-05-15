import Salon from "../model/Salon";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {useState} from "react";
import salon1 from "../assets/salon1.jpg";

export interface SalonCardProps {
    salon: Salon;
    onSelect: (salon: Salon) => void;
}

function SalonCard({ salon, onSelect }: SalonCardProps) {
    const [favourite, setFavourite] = useState(false);

    return (
        <div
            className="card salon-card"
            onClick={() => onSelect(salon)}
            style={{ cursor: "pointer", width: 250, margin: "1rem" }}
        >
            <button
                className="favorite-btn"
                onClick={e => {
                    e.stopPropagation();
                    setFavourite(f => !f);
                }}
            >
                {favourite ? <FaHeart /> : <FaRegHeart />}
            </button>

            <img
                src={salon1}
                className="card-img-top"
                alt={salon.name}
                style={{ height: 150, objectFit: "cover" }}
            />

            <div className="card-body text-center">
                <h5 className="card-title">{salon.name}</h5>
                <p className="card-text">Phone: {salon.phoneNumber}</p>
            </div>
        </div>
    );
}

export default SalonCard;
