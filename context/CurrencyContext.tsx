import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'GEL' | 'RUB';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (usdAmount: number) => string;
    getSymbol: () => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATES = {
    USD: 1,
    GEL: 2.70,
    RUB: 91.50,
};

const CURRENCY_SYMBOLS = {
    USD: '$',
    GEL: '₾',
    RUB: '₽',
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('USD');

    const getSymbol = () => CURRENCY_SYMBOLS[currency];

    const formatPrice = (usdAmount: number) => {
        const rate = EXCHANGE_RATES[currency];
        const converted = usdAmount * rate;
        const symbol = getSymbol();

        // Format the number based on currency specific rules
        if (currency === 'RUB') {
            // No decimals for RUB as it gets large
            return `${Math.round(converted).toLocaleString('ru-RU')} ${symbol}`;
        }

        if (currency === 'GEL') {
            // Space before symbol for GEL
            return `${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${symbol}`;
        }

        // Default USD
        return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getSymbol, exchangeRate: EXCHANGE_RATES[currency] }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
