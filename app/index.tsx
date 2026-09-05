import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AboutScreen } from '../AboutScreen';
import { HomeScreen } from '../HomeScreen';
import { ReceiptScreen } from '../ReceiptScreen';
import { SettingsScreen } from '../SettingsScreen';

type TabKey = 'counter' | 'receipt' | 'settings' | 'about';

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
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);

  useEffect(() => {
    const onBackPress = () => {
      // If on other tab, navigate back to the home (counter) tab
      if (activeTab !== 'counter') {
        setActiveTab('counter');
        return true;
      }

      // If already on home tab, handle double tap to exit
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPressTimeRef.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      } else {
        setShowExitToast(true);
        setTimeout(() => setShowExitToast(false), 2000);
      }
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [activeTab]);

  const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { key: 'counter', label: 'Payment', icon: 'calculator-outline', color: '#FACC15' },
    { key: 'receipt', label: 'Receipt', icon: 'cash-outline', color: '#86EFAC' },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', color: '#67E8F9' },
    { key: 'about', label: 'About', icon: 'heart-outline', color: '#FDA4AF' },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.rootContainer}>
      <StatusBar style="dark" />

      {/* Screen Body */}
      <View style={styles.screenContainer}>
        {activeTab === 'counter' && <HomeScreen isActive={activeTab === 'counter'} />}
        {activeTab === 'receipt' && <ReceiptScreen />}
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

      {/* Exit Toast Alert */}
      {showExitToast && (
        <View style={[styles.exitToast, hardShadow(2)]}>
          <Text style={styles.exitToastText}>Press back again to exit</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exitToast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  exitToastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
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
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabButtonActive: {
    // Styling handled dynamically
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '900',
  },
  tabLabelActive: {
    color: '#000',
  },
  tabLabelInactive: {
    color: '#4B5563',
  },
});
