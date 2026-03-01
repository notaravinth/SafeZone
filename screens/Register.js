import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register({ onRegisterComplete, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContact1Name: '',
    emergencyContact1Phone: '',
    emergencyContact2Name: '',
    emergencyContact2Phone: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!formData.emergencyContact1Name.trim() || !formData.emergencyContact1Phone.trim()) {
      Alert.alert('Error', 'Please add at least one emergency contact');
      return false;
    }
    if (formData.emergencyContact1Phone.length < 10) {
      Alert.alert('Error', 'Emergency contact 1 phone number is invalid');
      return false;
    }
    if (formData.emergencyContact2Phone && formData.emergencyContact2Phone.length < 10) {
      Alert.alert('Error', 'Emergency contact 2 phone number is invalid');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Create user account
      const userAccount = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        password: formData.password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
      };

      // Create emergency contacts array
      const emergencyContacts = [
        {
          id: '1',
          name: formData.emergencyContact1Name.trim(),
          phone: formData.emergencyContact1Phone.trim(),
        },
      ];

      if (formData.emergencyContact2Name.trim() && formData.emergencyContact2Phone.trim()) {
        emergencyContacts.push({
          id: '2',
          name: formData.emergencyContact2Name.trim(),
          phone: formData.emergencyContact2Phone.trim(),
        });
      }

      // Store user account
      await AsyncStorage.setItem('userAccount', JSON.stringify(userAccount));
      
      // Store emergency contacts
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
      
      // Mark as logged in
      await AsyncStorage.setItem('isLoggedIn', 'true');

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: onRegisterComplete }
      ]);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>SafeZone - Women & Children Safety Network</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#6B7280"
            value={formData.fullName}
            onChangeText={(text) => updateField('fullName', text)}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            maxLength={10}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password (min 6 characters)"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
          />

          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionDescription}>
            Add trusted contacts who will be notified in case of emergency
          </Text>

          <Text style={styles.label}>Emergency Contact 1 Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact name"
            placeholderTextColor="#6B7280"
            value={formData.emergencyContact1Name}
            onChangeText={(text) => updateField('emergencyContact1Name', text)}
          />

          <Text style={styles.label}>Emergency Contact 1 Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact phone number"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={formData.emergencyContact1Phone}
            onChangeText={(text) => updateField('emergencyContact1Phone', text)}
            maxLength={10}
          />

          <Text style={styles.label}>Emergency Contact 2 Name (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact name"
            placeholderTextColor="#6B7280"
            value={formData.emergencyContact2Name}
            onChangeText={(text) => updateField('emergencyContact2Name', text)}
          />

          <Text style={styles.label}>Emergency Contact 2 Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact phone number"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={formData.emergencyContact2Phone}
            onChangeText={(text) => updateField('emergencyContact2Phone', text)}
            maxLength={10}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={onNavigateToLogin}>
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D2E',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  registerButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#EC4899',
    fontWeight: 'bold',
  },
});
