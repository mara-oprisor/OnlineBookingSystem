import { useTranslation } from 'react-i18next';

function LanguageSelector() {
    const { i18n } = useTranslation();
    const langs = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'ro', label: 'Română' },
    ];

    return (
        <select
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            className="language-selector"
        >
            {langs.map(l => (
                <option key={l.code} value={l.code}>
                    {l.label}
                </option>
            ))}
        </select>
    );
}

export default LanguageSelector;
