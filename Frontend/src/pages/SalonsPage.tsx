import { useNavigate } from "react-router-dom";
import { useSalonCards } from "../hooks/useSalonCards";
import SalonCard from "../components/SalonCard";
import Salon from "../model/Salon.ts";
import NavBarClient from "../components/NavBarClient.tsx";
import {useTranslation} from "react-i18next";

function SalonsPage() {
    const { salons, loading, error } = useSalonCards();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSelectSalon = (salon: Salon) => {
        navigate(`/book/${salon.uuid}`, { state: { salon } });
    };

    if (loading) return <p>{t("salonsPage.loading")}</p>;
    if (error) return <p className="error-text">{t("salonsPage.error", { error })}</p>;

    return (
        <>
            <NavBarClient />

            <div className="salon-cards-container">
                <h2>{t("salonsPage.title")}</h2>
                <div className="card-grid" style={{ display: "flex", flexWrap: "wrap" }}>
                    {salons.map((salon) => (
                        <SalonCard key={salon.uuid} salon={salon} onSelect={handleSelectSalon} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default SalonsPage;
