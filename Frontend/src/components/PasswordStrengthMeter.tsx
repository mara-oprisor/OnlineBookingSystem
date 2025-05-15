import zxcvbn from "zxcvbn";

interface PasswordStrengthMeterProps{
    password: string;
}

function PasswordStrengthMeter({password}:PasswordStrengthMeterProps) {
    const {score, feedback} = zxcvbn(password);

    const percentage = (score / 4) * 100;
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const label  = labels[score];

    const colorClass =
        score <= 1 ? "bg-danger" :
            score === 2 ? "bg-warning" :
                "bg-success";

    return (
        <div className="mt-3">
            {/* Progress bar */}
            <div className="progress mb-2" style={{ height: 6 }}>
                <div
                    className={`progress-bar ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            <small className="text-muted">{label} ({Math.round(percentage)}%)</small>

            {feedback.warning && (
                <div className="text-warning mt-1">
                    ⚠️ {feedback.warning}
                </div>
            )}
            {feedback.suggestions.length > 0 && (
                <ul className="small text-muted mt-1">
                    {feedback.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PasswordStrengthMeter;