import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './screens/Login';
import Register from './screens/Register';
import ProfileSetup from './screens/ProfileSetup';
import Emergency from './screens/Emergency';
import EmergencyDetails from './screens/EmergencyDetails';
import Profile from './screens/Profile';
import FileComplaint from './screens/FileComplaint';
import SafetyTips from './screens/SafetyTips';
import Contact from './screens/Contact';
import { SyncManager } from './services/sync';
import { useNetworkStatus } from './hooks/useNetwork';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('emergency');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
  const [womenMode, setWomenMode] = useState(true);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    checkAuth();
    
    // Initialize sync manager after a delay to prevent startup issues
    setTimeout(() => {
      try {
        SyncManager.initialize();
      } catch (error) {
        console.log('Sync manager initialization deferred');
      }
    }, 2000);
  }, []);

  const checkAuth = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      const profile = await AsyncStorage.getItem('userProfile');
      
      setIsLoggedIn(loggedIn === 'true');
      setHasProfile(!!profile);
    } catch (error) {
      console.error('Failed to check auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterComplete = () => {
    setIsLoggedIn(true);
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
  };

  const handleEditProfile = async () => {
    await AsyncStorage.removeItem('userProfile');
    setHasProfile(false);
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleNavigateToFileComplaint = () => {
    setCurrentScreen('fileComplaint');
  };

  const handleNavigateToSafetyTips = () => {
    setCurrentScreen('safetyTips');
  };

  const handleNavigateToContact = () => {
    setCurrentScreen('contact');
  };

  const handleBackToEmergency = () => {
    setCurrentScreen('emergency');
    setSelectedEmergencyType(null);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setHasProfile(false);
    setCurrentScreen('emergency');
  };

  const handleNavigateToDetails = (emergencyType) => {
    setSelectedEmergencyType(emergencyType);
    setCurrentScreen('emergencyDetails');
  };

  const handleStartTracking = (trackingId) => {
    // Handle tracking start - can be used to update UI or state
    console.log('Tracking started:', trackingId);
  };

  // Screen navigation
  const renderScreen = () => {
    // Auth screens
    if (!isLoggedIn) {
      if (currentScreen === 'register') {
        return (
          <Register
            onRegisterComplete={handleRegisterComplete}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      }
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      );
    }

    // Profile setup if logged in but no profile
    if (!hasProfile) {
      return <ProfileSetup onProfileComplete={handleProfileComplete} />;
    }

    // Main app screens
    switch (currentScreen) {
      case 'profile':
        return (
          <Profile
            onBack={handleBackToEmergency}
            onLogout={handleLogout}
          />
        );
      case 'fileComplaint':
        return (
          <FileComplaint
            onBack={handleBackToEmergency}
          />
        );
      case 'safetyTips':
        return (
          <SafetyTips
            onBack={handleBackToEmergency}
            womenMode={womenMode}
            setWomenMode={setWomenMode}
          />
        );
      case 'contact':
        return (
          <Contact
            onBack={handleBackToEmergency}
          />
        );
      case 'emergencyDetails':
        return (
          <EmergencyDetails
            emergencyType={selectedEmergencyType}
            onBack={handleBackToEmergency}
            onStartTracking={handleStartTracking}
          />
        );
      default:
        return (
          <Emergency
            onEditProfile={handleEditProfile}
            onNavigateToDetails={handleNavigateToDetails}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToFileComplaint={handleNavigateToFileComplaint}
            onNavigateToSafetyTips={handleNavigateToSafetyTips}
            onNavigateToContact={handleNavigateToContact}
            womenMode={womenMode}
            setWomenMode={setWomenMode}
          />
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      {/* Network Status Indicator */}
      {!isOnline && isLoggedIn && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode - Data will sync when online</Text>
        </View>
      )}
      
      {renderScreen()}
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  offlineBanner: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingTop: 48, // Account for status bar
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
