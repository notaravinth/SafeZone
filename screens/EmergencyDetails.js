import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationService } from '../services/location';
import { EmergencyAPI } from '../services/api';

export default function EmergencyDetails({ emergencyType, onBack, onStartTracking }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleEmergencyCall = async () => {
    if (!selectedScenario) {
      Alert.alert('Select Scenario', 'Please select a scenario before calling');
      return;
    }

    const profile = await AsyncStorage.getItem('userProfile');
    const profileData = profile ? JSON.parse(profile) : null;

    Alert.alert(
      'Emergency Call',
      `This will:\n\n1. Call ${emergencyType.title} (${emergencyType.emergencyNumber})\n2. Notify your emergency contact\n3. Start location tracking\n\nScenario: ${selectedScenario}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'CALL NOW',
          onPress: async () => {
            // Call emergency number
            const phoneNumber = `tel:${emergencyType.emergencyNumber}`;
            Linking.openURL(phoneNumber);

            // Save emergency data
            if (profileData) {
              const locationResult = await LocationService.getCurrentLocation();
              const emergencyData = {
                type: emergencyType.id,
                title: emergencyType.title,
                scenario: selectedScenario,
                userProfile: profileData,
                location: locationResult.success ? locationResult.data : null,
                timestamp: new Date().toISOString(),
              };

              const result = await EmergencyAPI.createEmergency(emergencyData);
              
              if (result.success && result.data?.id) {
                onStartTracking(result.data.id);
              }

              // Also notify emergency contact
              if (profileData.emergencyContact) {
                setTimeout(() => {
                  Alert.alert(
                    'Notify Emergency Contact',
                    `Call ${profileData.emergencyName}?`,
                    [
                      { text: 'Later', style: 'cancel' },
                      {
                        text: 'Call Now',
                        onPress: () => {
                          const contactNumber = `tel:${profileData.emergencyContact}`;
                          Linking.openURL(contactNumber);
                        },
                      },
                    ]
                  );
                }, 1000);
              }
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderScenarioOption = (scenario, index) => {
    const isSelected = selectedScenario === scenario;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedScenario(scenario)}
        style={[
          styles.scenarioOption,
          isSelected && { ...styles.scenarioOptionSelected, backgroundColor: emergencyType.color },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.radioButton}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={[styles.scenarioText, isSelected && styles.scenarioTextSelected]}>
          {scenario}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: emergencyType.color }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{emergencyType.icon}</Text>
          <Text style={styles.headerTitle}>{emergencyType.title}</Text>
          <Text style={styles.headerNumber}>Emergency: {emergencyType.emergencyNumber}</Text>
        </View>
      </View>

      {/* Scenarios List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Select Your Emergency</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the situation that best describes your emergency
        </Text>

        <View style={styles.scenariosContainer}>
          {emergencyType.commonScenarios.map(renderScenarioOption)}
        </View>
      </ScrollView>

      {/* Call Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleEmergencyCall}
          disabled={!selectedScenario}
          style={[
            styles.callButton,
            { backgroundColor: emergencyType.color },
            !selectedScenario && styles.callButtonDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.callButtonText}>
            {selectedScenario ? `CALL ${emergencyType.emergencyNumber}` : 'SELECT A SCENARIO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
  },
  scenariosContainer: {
    gap: 12,
  },
  scenarioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  scenarioOptionSelected: {
    borderColor: 'transparent',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#60A5FA',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  scenarioText: {
    flex: 1,
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 22,
  },
  scenarioTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  callButton: {
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  callButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  callButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
