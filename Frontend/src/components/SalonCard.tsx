import Salon from "../model/Salon";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React, {useEffect, useState} from "react";
import salon1 from "../assets/salon1.jpg";
import SalonService from "../service/SalonService.tsx";

export interface SalonCardProps {
    salon: Salon;
    onSelect: (salon: Salon) => void;
}

function SalonCard({ salon, onSelect }: SalonCardProps) {
    const clientId = sessionStorage.getItem("uuid") as string;
    const [favourite, setFavourite] = useState((salon.favoriteFor ?? []).some(c => c.uuid === clientId));
    const salonService = SalonService();

    useEffect(() => {
        setFavourite(
            salon.favoriteFor?.some(c => c.uuid === clientId) ?? false
        );
    }, [salon.favoriteFor, clientId]);

    const toggleFav = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (!favourite) {
                await salonService.addFavorite(clientId, salon.uuid);
                setFavourite(true);
            } else {
                await salonService.removeFavorite(clientId, salon.uuid);
                setFavourite(false);
            }
        } catch (err) {
            console.error("Favorite toggle failed", err);
            alert("Could not update favorites. Please try again.");
        }
    };

    return (
        <div
            className="card salon-card"
            onClick={() => onSelect(salon)}
            style={{ cursor: "pointer", width: 250, margin: "1rem", position: "relative" }}
        >
            <button className="favorite-btn" onClick={toggleFav}>
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
