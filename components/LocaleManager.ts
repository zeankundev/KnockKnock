import Locales from "@/constants/Locales";
import { useEffect, useState } from "react";
import { getLocales } from "expo-localization";

export function useStringifiedLocale() {
    const [locale, setLocale] = useState<keyof typeof Locales>('en');
    useEffect(() => {
        const setDeviceLocale = async () => {
            const deviceLocales = getLocales();
            const preferredLocale = deviceLocales[0]?.languageCode || 'en';
            const supportedLocale = Object.keys(Locales).includes(preferredLocale) ? (preferredLocale as keyof typeof Locales) : 'en';
            setLocale(supportedLocale);
            console.log('📢 Locale set to:', supportedLocale);
        };

        setDeviceLocale();
    }, []);
    return locale;
}