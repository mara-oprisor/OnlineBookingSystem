import Salon from "../model/Salon";

export interface SalonCardProps {
    salon: Salon;
    onSelect: (salon: Salon) => void;
}

function SalonCard({ salon, onSelect }: SalonCardProps) {
    return (
        <div className="card salon-card" onClick={() => onSelect(salon)} style={{ cursor: "pointer", margin: "1rem" }}>
            <div className="card-body">
                <h5 className="card-title">{salon.name}</h5>
                <p className="card-text">Phone: {salon.phoneNumber}</p>
            </div>
        </div>
    );
}

export default SalonCard;
