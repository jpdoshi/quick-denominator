import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CURRENCY_CONFIGS, CurrencyCode } from './types';
import { useSettings } from './useDenomination';

const hardShadow = (offset = 3, bg = '#000') => ({
  borderWidth: 2.5,
  borderColor: '#000',
  ...Platform.select({
    web: {
      boxShadow: `${offset}px ${offset}px 0px 0px ${bg}`,
    },
    default: {
      shadowColor: bg,
      shadowOffset: { width: offset, height: offset },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
  }),
});

const CURRENCIES: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];

export const SettingsScreen: React.FC = () => {
  const {
    currency,
    setCurrency,
    denominations,
    toggleDenomination,
    resetDenominations,
    showQuickAdd,
    toggleQuickAdd,
  } = useSettings();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.headerCard, hardShadow(4)]}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>PREFERENCES</Text>
          </View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Configure currency & active denominations
          </Text>
        </View>

        {/* Currency Selector Section */}
        <View style={[styles.sectionCard, hardShadow(4)]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="cash-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>CURRENCY SYSTEM</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Select primary currency. INR formats amounts with Indian comma grouping (e.g. 1,00,000).
          </Text>

          <View style={styles.currencyChipsGrid}>
            {CURRENCIES.map((code) => {
              const cfg = CURRENCY_CONFIGS[code];
              const isSelected = currency === code;

              return (
                <TouchableOpacity
                  key={code}
                  activeOpacity={0.8}
                  onPress={() => setCurrency(code)}
                  style={[
                    styles.currencyChip,
                    isSelected ? styles.currencyChipSelected : styles.currencyChipUnselected,
                    hardShadow(isSelected ? 3 : 2),
                  ]}
                >
                  <Text
                    style={[
                      styles.currencySymbol,
                      isSelected ? styles.currencySymbolSelected : styles.currencySymbolUnselected,
                    ]}
                  >
                    {cfg.symbol}
                  </Text>
                  <View>
                    <Text
                      style={[
                        styles.currencyCode,
                        isSelected ? styles.currencyCodeSelected : styles.currencyCodeUnselected,
                      ]}
                    >
                      {cfg.code}
                    </Text>
                    <Text
                      style={[
                        styles.currencyName,
                        isSelected ? styles.currencyNameSelected : styles.currencyNameUnselected,
                      ]}
                    >
                      {cfg.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Add Presets Feature */}
        <View style={[styles.sectionCard, hardShadow(4)]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="flash-outline" size={20} color="#000" />
            <Text style={styles.sectionTitle}>QUICK-ADD PRESETS</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Display rapid quick-add buttons (+1K, +5K, +10K, +50K) below the amount input on Cashier screen.
          </Text>

          <View
            style={[
              styles.denomRow,
              showQuickAdd ? styles.denomRowActive : styles.denomRowInactive,
              hardShadow(2),
            ]}
          >
            <View style={styles.denomLeft}>
              <View style={styles.denomMeta}>
                <Text style={styles.denomLabel}>Quick Add Buttons</Text>
                <Text style={styles.denomSubLabelText}>
                  {showQuickAdd ? 'Visible on Cashier Counter' : 'Hidden from Cashier Counter'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleQuickAdd}
              style={[
                styles.toggleButton,
                showQuickAdd ? styles.toggleButtonOn : styles.toggleButtonOff,
                hardShadow(1.5),
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  showQuickAdd ? styles.toggleThumbOn : styles.toggleThumbOff,
                ]}
              />
              <Text
                style={[
                  styles.toggleText,
                  showQuickAdd ? styles.toggleTextOn : styles.toggleTextOff,
                ]}
              >
                {showQuickAdd ? 'ACTIVE' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Denomination Manager Section */}
        <View style={[styles.sectionCard, hardShadow(4)]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="list-circle-outline" size={22} color="#000" />
            <Text style={styles.sectionTitle}>DENOMINATION MANAGER</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Toggle notes on/off. Inactive notes are skipped by the Greedy Denomination algorithm.
          </Text>

          <View style={styles.denominationsList}>
            {denominations.map((denom) => {
              const is2000 = denom.value === 2000;
              return (
                <View
                  key={denom.value}
                  style={[
                    styles.denomRow,
                    denom.active ? styles.denomRowActive : styles.denomRowInactive,
                    hardShadow(2),
                  ]}
                >
                  <View style={styles.denomLeft}>
                    <View
                      style={[
                        styles.denomBadge,
                        { backgroundColor: denom.active ? '#FACC15' : '#E5E7EB' },
                        hardShadow(1.5),
                      ]}
                    >
                      <Text style={styles.denomBadgeText}>
                        {CURRENCY_CONFIGS[currency]?.symbol || '₹'}
                        {denom.value}
                      </Text>
                    </View>
                    <View style={styles.denomMeta}>
                      <Text style={styles.denomLabel}>
                        {denom.label || `${CURRENCY_CONFIGS[currency]?.symbol}${denom.value} Note`}
                      </Text>
                      {is2000 && (
                        <Text style={styles.denomSubLabel}>Withdrawn from regular circulation</Text>
                      )}
                    </View>
                  </View>

                  {/* Neubrutalist Toggle Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleDenomination(denom.value)}
                    style={[
                      styles.toggleButton,
                      denom.active ? styles.toggleButtonOn : styles.toggleButtonOff,
                      hardShadow(1.5),
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        denom.active ? styles.toggleThumbOn : styles.toggleThumbOff,
                      ]}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        denom.active ? styles.toggleTextOn : styles.toggleTextOff,
                      ]}
                    >
                      {denom.active ? 'ACTIVE' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Reset button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={resetDenominations}
            style={[styles.resetDefaultsButton, hardShadow(2.5)]}
          >
            <Ionicons name="refresh-circle-outline" size={20} color="#000" />
            <Text style={styles.resetDefaultsText}>RESET TO BANK DEFAULTS</Text>
          </TouchableOpacity>
        </View>

        {/* Persistence Notice Card */}
        <View style={[styles.noticeCard, hardShadow(2)]}>
          <Ionicons name="cloud-done-outline" size={18} color="#065F46" />
          <Text style={styles.noticeText}>
            Settings persist automatically to AsyncStorage on every change.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF0',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#67E8F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  headerBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 14,
    lineHeight: 18,
  },
  currencyChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  currencyChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  currencyChipSelected: {
    backgroundColor: '#FACC15',
  },
  currencyChipUnselected: {
    backgroundColor: '#F9FAFB',
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '900',
  },
  currencySymbolSelected: {
    color: '#000',
  },
  currencySymbolUnselected: {
    color: '#6B7280',
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '900',
  },
  currencyCodeSelected: {
    color: '#000',
  },
  currencyCodeUnselected: {
    color: '#374151',
  },
  currencyName: {
    fontSize: 10,
    fontWeight: '700',
  },
  currencyNameSelected: {
    color: '#1F2937',
  },
  currencyNameUnselected: {
    color: '#9CA3AF',
  },
  denominationsList: {
    gap: 10,
    marginBottom: 16,
  },
  denomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  denomRowActive: {
    backgroundColor: '#FFF',
  },
  denomRowInactive: {
    backgroundColor: '#F3F4F6',
    opacity: 0.8,
  },
  denomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  denomBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  denomBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
  },
  denomMeta: {
    flex: 1,
  },
  denomLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000',
  },
  denomSubLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 1,
  },
  denomSubLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 1,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  toggleButtonOn: {
    backgroundColor: '#86EFAC',
  },
  toggleButtonOff: {
    backgroundColor: '#E5E7EB',
  },
  toggleThumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  toggleThumbOn: {
    backgroundColor: '#065F46',
  },
  toggleThumbOff: {
    backgroundColor: '#9CA3AF',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '900',
  },
  toggleTextOn: {
    color: '#064E3B',
  },
  toggleTextOff: {
    color: '#6B7280',
  },
  resetDefaultsButton: {
    backgroundColor: '#FED7AA',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resetDefaultsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  noticeCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
});
