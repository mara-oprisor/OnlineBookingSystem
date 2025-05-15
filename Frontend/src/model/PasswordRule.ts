export interface PasswordRule {
    id: string;
    label: string;
    test: (t: string) => boolean;
}

function getPasswordRules(): PasswordRule[] {
    const rules: PasswordRule[] = [
        {
            id: "length",
            label: "Password is at least 8 characters long",
            test: t => t.length >= 8
        },
        {
            id: "lowercase",
            label: "Password must contain at least a lowercase letter",
            test: t => /[a-z]/.test(t)
        },
        {
            id: "uppercase",
            label: "Password must contain at least an uppercase letter",
            test: t => /[A-Z]/.test(t)
        },
        {
            id: "digit",
            label: "Password must contain at least one digit",
            test: t => /[0-9]/.test(t)
        },
        {
            id: "symbol",
            label: "Password must contain a special character (!@#$%&*)",
            test: t => /[!@#$%&*]/.test(t)
        }
    ];

    return rules;
}

export default getPasswordRules;