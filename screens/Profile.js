import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ onBack, onLogout }) {
  const [userAccount, setUserAccount] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const accountStr = await AsyncStorage.getItem('userAccount');
      const contactsStr = await AsyncStorage.getItem('emergencyContacts');
      
      if (accountStr) {
        setUserAccount(JSON.parse(accountStr));
      }
      if (contactsStr) {
        setEmergencyContacts(JSON.parse(contactsStr));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleCallContact = (phone, name) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${name} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('isLoggedIn', 'false');
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  if (!userAccount) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>WOMEN-ONLY</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <View style={styles.profileIconLarge}>
                <View style={styles.profileIconHeadLarge} />
                <View style={styles.profileIconBodyLarge} />
              </View>
            </View>
            <View style={styles.verificationBadge}>
              <View style={styles.verificationIcon} />
            </View>
          </View>
          <Text style={styles.profileName}>{userAccount.fullName}</Text>
          <Text style={styles.profileRole}>SafeZone User</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <View style={styles.sectionIcon} />
            </View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userAccount.fullName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{userAccount.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>Current Location</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#4F46E5' }]}>
              <View style={styles.sectionIcon} />
            </View>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          </View>
          {emergencyContacts.map((contact, index) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactIconContainer}>
                <View style={styles.contactIcon} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{index === 0 ? 'Primary Contact' : 'Secondary Contact'}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCallContact(contact.phone, contact.name)}
              >
                <View style={styles.callIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Call All Section */}
        <TouchableOpacity
          style={styles.callAllButton}
          onPress={() => {
            if (emergencyContacts.length > 0) {
              handleCallContact(emergencyContacts[0].phone, emergencyContacts[0].name);
            }
          }}
        >
          <View style={styles.callAllIcon} />
          <Text style={styles.callAllText}>CALL PRIMARY CONTACT</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.navIconInactive} />
          <Text style={styles.navLabel}>EXPLORE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={onBack}>
          <View style={styles.navIconHome} />
          <Text style={styles.navLabelActive}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.navIconInactive} />
          <Text style={styles.navLabel}>SAFETY TIPS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1A1D2E',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#EC4899',
    borderRadius: 4,
    marginRight: 8,
  },
  backText: {
    color: '#EC4899',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toggleContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toggleLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D3748',
    borderWidth: 4,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileIconLarge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconHeadLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    marginBottom: 4,
  },
  profileIconBodyLarge: {
    width: 48,
    height: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#9CA3AF',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1A1D2E',
  },
  verificationIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    color: '#D1FAE5',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
  },
  contactCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  callAllButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  callAllIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 10,
  },
  callAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    marginHorizontal: 16,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#1A1D2E',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navIconInactive: {
    width: 24,
    height: 24,
    backgroundColor: '#6B7280',
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconHome: {
    width: 24,
    height: 24,
    backgroundColor: '#4F46E5',
    borderRadius: 4,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
