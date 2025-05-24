import { Box, CircularProgress } from "@mui/material";
import NavBarClient from "../components/NavBarClient";
import useLoyaltyPoints from "../hooks/useLoyaltyPoints";

const TIERS = [
    { name: "Bronze", limit: 200, color: "#cd7f32", discount: 5 },
    { name: "Silver", limit: 500, color: "#c0c0c0", discount: 10 },
    { name: "Gold", limit: 1000, color: "#ffd700", discount: 15 },
];

function MyLoyaltyPage() {
    const { points, loading, error } = useLoyaltyPoints();

    const getUserTier = () => {
        if (points < TIERS[0].limit) {
            return { name: null, discount: 0 };
        }
        for (const tier of TIERS) {
            if (points >= tier.limit) {
                if (tier === TIERS[TIERS.length - 1] || points < TIERS[TIERS.indexOf(tier) + 1].limit) {
                    return tier;
                }
            }
        }
        return TIERS[0];
    };

    const userTier = getUserTier();

    if (loading) {
        return (
            <>
                <NavBarClient />
                <Box sx={{ mt: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                    <span style={{ marginLeft: "16px" }}>Loading points...</span>
                </Box>
            </>
        );
    }

    if (error || points === null) {
        return (
            <>
                <NavBarClient />
                <Box sx={{ mt: 8, textAlign: "center", color: "error.main" }}>
                    <p>{error || "Failed to load points"}</p>
                </Box>
            </>
        );
    }

    return (
        <>
            <NavBarClient />
            <div className="my-bookings-page">
                <div className="content-container">
                    <h1 style={{ fontSize: "2rem", fontWeight: "500", marginBottom: "16px" }}>
                        My Loyalty Points
                    </h1>
                    <h2 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "16px" }}>
                        {points}
                    </h2>
                    <p style={{ fontSize: "1.25rem", marginBottom: "32px", color: "#555" }}>
                        {userTier.name
                            ? `You are a ${userTier.name} loyal client with ${userTier.discount}% discount at every booking!`
                            : "Not yet a loyal client. Earn more points to unlock discounts!"}
                    </p>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "48px",
                        }}
                    >
                        {TIERS.map((tier) => {
                            const progress = Math.min(100, (points / tier.limit) * 100);
                            const pointsDisplay = Math.min(points, tier.limit);
                            return (
                                <Box
                                    key={tier.name}
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: { xs: "100%", sm: "250px" },
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={progress}
                                        size={150}
                                        thickness={6}
                                        sx={{ color: tier.color }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                                            {tier.name}
                                        </div>
                                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                            {`${pointsDisplay}/${tier.limit}`}
                                        </div>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </div>
            </div>
        </>
    );
}

export default MyLoyaltyPage;