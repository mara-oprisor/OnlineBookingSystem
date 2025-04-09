import { useNavigate } from "react-router-dom";
import { useSalons } from "../hooks/useSalonCards";
import SalonCard from "../components/SalonCard";
import Salon from "../model/Salon.ts";

function SalonsPage() {
    const { salons, loading, error } = useSalons();
    const navigate = useNavigate();

    const handleSelectSalon = (salon: Salon) => {
        navigate(`/book/${salon.uuid}`, { state: { salon } });
    };

    if (loading) return <p>Loading salons...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="salon-cards-container">
            <h2>Salons</h2>
            <div className="card-grid" style={{ display: "flex", flexWrap: "wrap" }}>
                {salons.map((salon) => (
                    <SalonCard key={salon.uuid} salon={salon} onSelect={handleSelectSalon} />
                ))}
            </div>
        </div>
    );
}

export default SalonsPage;
