import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../HomeScreen';
import { SettingsScreen } from '../SettingsScreen';
import { AboutScreen } from '../AboutScreen';

type TabKey = 'counter' | 'settings' | 'about';

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

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabKey>('counter');

  const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'counter', label: 'Cashier', icon: 'calculator-outline', color: '#FACC15' },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', color: '#67E8F9' },
    { key: 'about', label: 'About', icon: 'heart-outline', color: '#FDA4AF' },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.rootContainer}>
      <StatusBar style="dark" />

      {/* Screen Body */}
      <View style={styles.screenContainer}>
        {activeTab === 'counter' && <HomeScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'about' && <AboutScreen />}
      </View>

      {/* Neubrutalist Bottom Tab Bar with Native Additive Safe Area */}
      <SafeAreaView edges={['bottom']} style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabButton,
                  isActive
                    ? [styles.tabButtonActive, { backgroundColor: tab.color }, hardShadow(2)]
                    : styles.tabButtonInactive,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={isActive ? '#000' : '#4B5563'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFDF0',
  },
  screenContainer: {
    flex: 1,
  },
  tabBarWrapper: {
    borderTopWidth: 2.5,
    borderTopColor: '#000',
    backgroundColor: '#FFF',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    // Styling handled dynamically
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '900',
  },
  tabLabelActive: {
    color: '#000',
  },
  tabLabelInactive: {
    color: '#4B5563',
  },
});
