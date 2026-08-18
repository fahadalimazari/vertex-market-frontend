import { createContext, useState, useEffect, useCallback } from 'react';
import { languages as fallbackLanguages } from '../data/languages';
import { currencies as fallbackCurrencies } from '../data/currencies';
import { countries } from '../data/countries';
import { fetchExchangeRates } from '../data/exchangeRates';
import { formatPrice as formatPriceUtil } from '../utils/formatCurrency';
import { detectUserLocale } from '../utils/formatters';
import { useAuth } from './AuthContext';

export const LocalizationContext = createContext(null);

export const LocalizationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth() || {};
  
  // Dynamic lists loaded from MongoDB
  const [languagesList, setLanguagesList] = useState(fallbackLanguages);
  const [currenciesList, setCurrenciesList] = useState(fallbackCurrencies);
  
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('US');
  const [timezone, setTimezone] = useState('UTC');
  const [rtl, setRtl] = useState(false);
  const [translations, setTranslations] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Fetch dynamic Languages and Currencies from Admin MongoDB APIs
  useEffect(() => {
    const fetchEnterpriseLocalization = async () => {
      try {
        const [langRes, currRes] = await Promise.all([
          fetch('https://vertex-market-backend.vercel.app/api/v1/languages'),
          fetch('https://vertex-market-backend.vercel.app/api/v1/currencies')
        ]);
        const langData = await langRes.json();
        const currData = await currRes.json();
        
        if (langData.success && langData.data && langData.data.length > 0) {
          const mappedLangs = langData.data.map(l => ({
            code: l.code,
            name: l.name,
            nativeName: l.nativeName || l.name,
            dir: l.isRtl || l.code === 'ur' || l.code === 'ar' ? 'rtl' : 'ltr',
            flag: l.flag || '🌐',
            progress: l.translationProgress || 100
          }));
          setLanguagesList(mappedLangs);
        }
        
        if (currData.success && currData.data && currData.data.length > 0) {
          const mappedCurrencies = currData.data.map(c => ({
            code: c.code,
            name: c.name,
            symbol: c.symbol,
            rate: c.manualOverrideRate ? c.manualOverrideRate : c.exchangeRate
          }));
          setCurrenciesList(mappedCurrencies);

          // Build exchange rates mapping for dynamic conversion
          const rateMap = {};
          mappedCurrencies.forEach(c => {
            rateMap[c.code] = c.rate || 1.0;
          });
          setExchangeRates(prev => ({ ...prev, ...rateMap }));
        }
      } catch (error) {
        console.warn("Using fallback localizations:", error);
      }
    };
    fetchEnterpriseLocalization();
  }, []);

  // Initialize and load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      const saved = localStorage.getItem('vertex_localization_v1');
      let prefs = {};

      if (saved) {
        prefs = JSON.parse(saved);
      } else {
        const detected = detectUserLocale();
        prefs = {
          language: detected.suggestedLang || 'en',
          currency: detected.suggestedCurrency || 'USD',
          country: detected.suggestedCountry || 'US',
          timezone: detected.timezone || 'UTC'
        };
        setIsFirstVisit(true);
      }

      setLanguage(prefs.language);
      setCurrency(prefs.currency);
      setCountry(prefs.country);
      setTimezone(prefs.timezone);
      
      const isRtlLang = prefs.language === 'ur' || prefs.language === 'ar';
      setRtl(isRtlLang);
      document.documentElement.dir = isRtlLang ? 'rtl' : 'ltr';
      document.documentElement.lang = prefs.language;

      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(prev => ({ ...rates.rates, ...prev }));
        
        const translationModule = await import(`../locales/${prefs.language}/common.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        try {
            const fallbackModule = await import(`../locales/en/common.json`);
            setTranslations(fallbackModule.default);
        } catch (e) {
            setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Sync database preferences to state when logged in
  useEffect(() => {
    if (isAuthenticated && user?.preferences) {
      const { language: lang, currency: curr, country: count } = user.preferences;
      if (lang) {
        setLanguage(lang);
        const isRtlLang = lang === 'ur' || lang === 'ar';
        setRtl(isRtlLang);
        document.documentElement.dir = isRtlLang ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        import(`../locales/${lang}/common.json`).then(module => {
          setTranslations(module.default);
        }).catch(() => {});
      }
      if (curr) setCurrency(curr);
      if (count) {
        setCountry(count);
        const cDef = countries.find(c => c.code === count);
        if (cDef) setTimezone(cDef.timezone);
      }
    }
  }, [user, isAuthenticated]);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vertex_localization_v1', JSON.stringify({
        language,
        currency,
        country,
        timezone
      }));
    }
  }, [language, currency, country, timezone, isLoading]);

  const syncPreferences = useCallback(async (lang, curr, count) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      await fetch('https://vertex-market-backend.vercel.app/api/v1/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ language: lang, currency: curr, country: count })
      });
    } catch (error) {
      console.error('Failed to sync preferences to backend', error);
    }
  }, []);

  const changeLanguage = useCallback(async (code) => {
    setLanguage(code);
    const langDef = languagesList.find(l => l.code === code);
    const isRtlLang = code === 'ur' || code === 'ar' || langDef?.dir === 'rtl';
    setRtl(isRtlLang);
    document.documentElement.dir = isRtlLang ? 'rtl' : 'ltr';
    document.documentElement.lang = code;

    try {
      const module = await import(`../locales/${code}/common.json`);
      setTranslations(module.default);
    } catch (e) {
      console.warn(`Translation for ${code} not found, falling back to English`);
      const fallback = await import(`../locales/en/common.json`);
      setTranslations(fallback.default);
    }

    if (isAuthenticated) {
      syncPreferences(code, currency, country);
    }
  }, [isAuthenticated, currency, country, syncPreferences, languagesList]);

  const changeCurrency = useCallback((code) => {
    setCurrency(code);
    if (isAuthenticated) {
      syncPreferences(language, code, country);
    }
  }, [isAuthenticated, language, country, syncPreferences]);
  
  const changeCountry = useCallback((code) => {
    setCountry(code);
    const cDef = countries.find(c => c.code === code);
    let targetCurrency = currency;
    if (cDef) {
        targetCurrency = cDef.currency;
        setCurrency(cDef.currency);
        setTimezone(cDef.timezone);
    }
    if (isAuthenticated) {
      syncPreferences(language, targetCurrency, code);
    }
  }, [isAuthenticated, language, currency, syncPreferences]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }
    return result;
  }, [translations]);

  const formatPrice = useCallback((amountInUSD) => {
    return formatPriceUtil(amountInUSD, currency, exchangeRates, `${language}-${country}`);
  }, [currency, exchangeRates, language, country]);

  const savePreferences = useCallback((prefs) => {
    if (prefs.language) changeLanguage(prefs.language);
    if (prefs.currency) changeCurrency(prefs.currency);
    if (prefs.country) changeCountry(prefs.country);
    if (prefs.timezone) setTimezone(prefs.timezone);
    setIsFirstVisit(false);
  }, [changeLanguage, changeCurrency, changeCountry]);

  const value = {
    language,
    currency,
    country,
    timezone,
    rtl,
    isLoading,
    isFirstVisit,
    languages: languagesList,
    currencies: currenciesList,
    countries,
    changeLanguage,
    changeCurrency,
    changeCountry,
    savePreferences,
    dismissFirstVisit: () => setIsFirstVisit(false),
    t,
    formatPrice
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
