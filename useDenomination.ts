import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CurrencyCode,
  DenominationItem,
  CalculationResult,
  DEFAULT_DENOMINATIONS,
} from './types';

const STORAGE_KEY = '@quick_cashier_settings_v2';

export function calculateBreakdown(amount: number, activeNotes: number[]): CalculationResult {
  const safeAmount = Math.max(0, Math.floor(amount || 0));
  const sortedNotes = [...activeNotes].sort((a, b) => b - a);

  let remaining = safeAmount;
  let totalNotes = 0;
  let totalDistributed = 0;

  const breakdown = sortedNotes.map((note) => {
    const count = note > 0 ? Math.floor(remaining / note) : 0;
    const subtotal = count * note;
    remaining %= note;
    totalNotes += count;
    totalDistributed += subtotal;
    return {
      denomination: note,
      count,
      subtotal,
    };
  });

  return {
    breakdown,
    totalAmount: totalDistributed,
    totalNotes,
    unpayableAmount: remaining,
  };
}

interface SettingsContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  denominations: DenominationItem[];
  toggleDenomination: (value: number) => void;
  resetDenominations: () => void;
  showQuickAdd: boolean;
  setShowQuickAdd: (show: boolean) => void;
  toggleQuickAdd: () => void;
  activeNotes: number[];
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');
  const [denominations, setDenominations] = useState<DenominationItem[]>(DEFAULT_DENOMINATIONS);
  const [showQuickAdd, setShowQuickAddState] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.currency) setCurrencyState(parsed.currency);
          if (typeof parsed.showQuickAdd === 'boolean') {
            setShowQuickAddState(parsed.showQuickAdd);
          }
          if (Array.isArray(parsed.denominations)) {
            const storedValues = new Set(parsed.denominations.map((d: DenominationItem) => d.value));
            const merged = [
              ...parsed.denominations,
              ...DEFAULT_DENOMINATIONS.filter((d) => !storedValues.has(d.value)),
            ];
            setDenominations(merged);
          }
        }
      } catch (e) {
        console.error('Failed to load cashier settings', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const saveSettings = useCallback(
    async (newCurr: CurrencyCode, newDenoms: DenominationItem[], newQuickAdd: boolean) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ currency: newCurr, denominations: newDenoms, showQuickAdd: newQuickAdd })
        );
      } catch (e) {
        console.error('Failed to persist cashier settings', e);
      }
    },
    []
  );

  const setCurrency = useCallback(
    (newCurr: CurrencyCode) => {
      setCurrencyState(newCurr);
      saveSettings(newCurr, denominations, showQuickAdd);
    },
    [denominations, showQuickAdd, saveSettings]
  );

  const toggleDenomination = useCallback(
    (value: number) => {
      setDenominations((prev) => {
        const updated = prev.map((item) =>
          item.value === value ? { ...item, active: !item.active } : item
        );
        saveSettings(currency, updated, showQuickAdd);
        return updated;
      });
    },
    [currency, showQuickAdd, saveSettings]
  );

  const setShowQuickAdd = useCallback(
    (show: boolean) => {
      setShowQuickAddState(show);
      saveSettings(currency, denominations, show);
    },
    [currency, denominations, saveSettings]
  );

  const toggleQuickAdd = useCallback(() => {
    setShowQuickAddState((prev) => {
      const next = !prev;
      saveSettings(currency, denominations, next);
      return next;
    });
  }, [currency, denominations, saveSettings]);

  const resetDenominations = useCallback(() => {
    setDenominations(DEFAULT_DENOMINATIONS);
    setCurrencyState('INR');
    setShowQuickAddState(true);
    saveSettings('INR', DEFAULT_DENOMINATIONS, true);
  }, [saveSettings]);

  const activeNotes = useMemo(
    () => denominations.filter((d) => d.active).map((d) => d.value),
    [denominations]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      denominations,
      toggleDenomination,
      resetDenominations,
      showQuickAdd,
      setShowQuickAdd,
      toggleQuickAdd,
      activeNotes,
      isLoaded,
    }),
    [
      currency,
      setCurrency,
      denominations,
      toggleDenomination,
      resetDenominations,
      showQuickAdd,
      setShowQuickAdd,
      toggleQuickAdd,
      activeNotes,
      isLoaded,
    ]
  );

  return React.createElement(SettingsContext.Provider, { value }, children);
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export function useDenomination(initialAmount = '') {
  const settings = useSettings();
  const [rawInput, setRawInput] = useState<string>(initialAmount);

  const numericAmount = useMemo(() => {
    const cleaned = rawInput.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  }, [rawInput]);

  const result = useMemo(() => {
    return calculateBreakdown(numericAmount, settings.activeNotes);
  }, [numericAmount, settings.activeNotes]);

  const setAmountString = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    // Limit max to 10 crores (10,00,00,000) to prevent overflow
    if (cleaned.length <= 10) {
      setRawInput(cleaned);
    }
  }, []);

  const addPreset = useCallback((value: number) => {
    setRawInput((prev) => {
      const current = prev.replace(/[^0-9]/g, '');
      const currentNum = current ? parseInt(current, 10) : 0;
      const nextNum = Math.min(currentNum + value, 99999999);
      return nextNum.toString();
    });
  }, []);

  const clearAmount = useCallback(() => {
    setRawInput('');
  }, []);

  return {
    rawInput,
    numericAmount,
    setAmountString,
    addPreset,
    clearAmount,
    result,
    ...settings,
  };
}
