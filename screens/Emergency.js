import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  Dimensions,
  Switch,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { LocationService } from '../services/location';
import { EmergencyAPI } from '../services/api';
import { useShake } from '../hooks/useShake';

const { width, height } = Dimensions.get('window');

// Dark map style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

export default function Emergency({
  onNavigateToEmergencyDetails,
  onNavigateToProfile,
  onNavigateToFileComplaint,
  onNavigateToSafetyTips,
  onNavigateToContact,
  womenMode,
  setWomenMode,
}) {
  const [location, setLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadEmergencyContacts();
    getCurrentLocation();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('emergencyContacts');
      if (contacts) {
        setEmergencyContacts(JSON.parse(contacts));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await LocationService.getCurrentLocation();
      if (loc.success && loc.data) {
        setLocation(loc.data);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  };

  const handleEmergencyCall = async (number) => {
    try {
      const phoneNumber = `tel:${number}`;
      const canOpen = await Linking.canOpenURL(phoneNumber);
      
      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert('Error', 'Unable to make phone call');
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
      Alert.alert('Error', 'Failed to initiate emergency call');
    }
  };

  const handleShake = () => {
    handleEmergencyCall('112');
  };

  useShake(handleShake, 3.5, 2000);

  const callEmergencyContact = async () => {
    if (emergencyContacts.length > 0) {
      const primaryContact = emergencyContacts[0];
      handleEmergencyCall(primaryContact.phone);
    } else {
      Alert.alert('No Emergency Contact', 'Please add emergency contacts in your profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>VIGILON</Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>WOMEN-ONLY</Text>
          <Switch
            value={womenMode}
            onValueChange={setWomenMode}
            trackColor={{ false: '#3B82F6', true: '#EC4899' }}
            thumbColor={womenMode ? '#FFFFFF' : '#f4f3f4'}
            style={styles.toggle}
          />
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuDrawer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onNavigateToProfile?.();
              }}
            >
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onNavigateToFileComplaint?.();
              }}
            >
              <Text style={styles.menuItemText}>File a Complaint</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onNavigateToSafetyTips?.();
              }}
            >
              <Text style={styles.menuItemText}>Safety Tips</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onNavigateToContact?.();
              }}
            >
              <Text style={styles.menuItemText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Banner */}
        <View style={styles.locationBanner}>
          <View style={styles.locationPinIcon}>
            <View style={styles.locationPinCircle} />
          </View>
          <View>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.locationAddress}>
              {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Detecting location...'}
            </Text>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            customMapStyle={darkMapStyle}
            region={
              location
                ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : {
                    latitude: 28.6139,
                    longitude: 77.209,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
            }
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Your Location"
              >
                <View style={styles.pinCircle} />
              </Marker>
            )}
          </MapView>
        </View>

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={[styles.sosButton, !selectedCategory && styles.sosButtonDisabled]}
            onPress={() => selectedCategory && handleEmergencyCall('112')}
            disabled={!selectedCategory}
          >
            <View style={styles.warningTriangleContainer}>
              <View style={styles.warningTriangle} />
              <Text style={styles.warningExclamation}>!</Text>
            </View>
            <Text style={[styles.sosText, !selectedCategory && styles.sosTextDisabled]}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Info */}
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryInfoTitle}>Tap a category to enable SOS</Text>
          <Text style={styles.categoryInfoSubtitle}>
            Selecting a reason activates the emergency trigger
          </Text>
        </View>

        {/* Emergency Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={[
                styles.categoryCircle,
                selectedCategory === (womenMode ? 'following' : 'lost') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'following' : 'lost')}
            >
              {womenMode ? (
                <View style={styles.followingIcon}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                </View>
              ) : (
                <View style={styles.lostIcon}>
                  <View style={styles.eyeClosed} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCircle,
                selectedCategory === (womenMode ? 'lost' : 'bullying') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'lost' : 'bullying')}
            >
              {womenMode ? (
                <View style={styles.lostIcon}>
                  <View style={styles.eyeClosed} />
                </View>
              ) : (
                <View style={styles.bullyingIcon}>
                  <View style={styles.handStop} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCircle,
                selectedCategory === (womenMode ? 'harassed' : 'stranger') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'harassed' : 'stranger')}
            >
              {womenMode ? (
                <View style={styles.harassedIcon}>
                  <View style={styles.personDistress} />
                </View>
              ) : (
                <View style={styles.strangerIcon}>
                  <View style={styles.questionMark} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.categoryLabelRow}>
            <Text style={styles.categoryLabelText}>
              {womenMode ? 'FOLLOWING' : 'LOST'}
            </Text>
            <Text style={styles.categoryLabelText}>
              {womenMode ? 'LOST' : 'BULLYING'}
            </Text>
            <Text style={styles.categoryLabelText}>
              {womenMode ? 'HARASSED' : 'STRANGER'}
            </Text>
          </View>

          <View style={[styles.categoryRow, { marginTop: 20 }]}>
            <TouchableOpacity
              style={[
                styles.categoryCircle,
                selectedCategory === (womenMode ? 'medical' : 'injured') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'medical' : 'injured')}
            >
              <View style={styles.medicalIcon}>
                <View style={styles.medicalCross} />
                <View style={styles.medicalCrossHorizontal} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCircle,
                selectedCategory === (womenMode ? 'other' : 'scared') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'other' : 'scared')}
            >
              {womenMode ? (
                <View style={styles.otherIcon}>
                  <View style={styles.threeDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              ) : (
                <View style={styles.scaredIcon}>
                  <View style={styles.exclamationCircle} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCircle,
                styles.categoryCircleSafetyCheck,
                selectedCategory === (womenMode ? 'safetyCheck' : 'contact') && styles.categoryCircleSelected
              ]}
              onPress={() => setSelectedCategory(womenMode ? 'safetyCheck' : 'contact')}
            >
              {womenMode ? (
                <View style={styles.safetyIcon}>
                  <View style={styles.shieldOuter} />
                  <View style={styles.shieldCheck} />
                </View>
              ) : (
                <View style={styles.contactIcon}>
                  <View style={styles.phoneCircle} />
                  <View style={styles.phoneHandle} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.categoryLabelRow}>
            <Text style={styles.categoryLabelText}>
              {womenMode ? 'MEDICAL' : 'INJURED'}
            </Text>
            <Text style={styles.categoryLabelText}>
              {womenMode ? 'OTHER' : 'SCARED'}
            </Text>
            <Text style={[styles.categoryLabelText, styles.categoryLabelSafety]}>
              {womenMode ? 'SAFETY\nCHECK' : 'CALL\nPARENT'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.exploreNavIcon}>
            <View style={styles.compassCircle} />
            <View style={styles.compassNeedle} />
          </View>
          <Text style={styles.navLabel}>EXPLORE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonActive]}>
          <View style={styles.homeNavIcon}>
            <View style={styles.homeRoof} />
            <View style={styles.homeBase} />
          </View>
          <Text style={styles.navLabelActive}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigateToSafetyTips?.()}
        >
          <View style={styles.tipsNavIcon}>
            <View style={styles.lightbulbCircle} />
            <View style={styles.lightbulbBase} />
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1A1D2E',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuButton: {
    padding: 8,
    justifyContent: 'space-between',
    height: 24,
    width: 28,
  },
  hamburgerLine: {
    width: 28,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleLabel: {
    fontSize: 11,
    color: '#EC4899',
    fontWeight: 'bold',
    marginRight: 8,
  },
  toggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuDrawer: {
    backgroundColor: '#2D3748',
    marginTop: 110,
    marginLeft: 16,
    borderRadius: 12,
    minWidth: 200,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1A1D2E',
  },
  locationPinIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#EC4899',
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPinCircle: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  locationTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pinCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EC4899',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sosContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#EC4899',
  },
  sosButtonDisabled: {
    backgroundColor: 'rgba(45, 55, 72, 0.6)',
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  warningTriangleContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 52,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#6B7280',
    position: 'absolute',
  },
  warningExclamation: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    position: 'absolute',
    bottom: 12,
  },
  sosText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#EC4899',
    letterSpacing: 4,
  },
  sosTextDisabled: {
    color: '#6B7280',
  },
  categoryInfo: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 30,
  },
  categoryInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryInfoSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#1A1D2E',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  categoryCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  categoryCircleSelected: {
    backgroundColor: '#4B1F3C',
    borderColor: '#EC4899',
    borderWidth: 3,
  },
  categoryCircleSafetyCheck: {
    backgroundColor: '#4B1F3C',
    borderColor: '#EC4899',
  },
  // Category Icons
  followingIcon: {
    alignItems: 'center',
  },
  personHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EC4899',
    marginBottom: 4,
  },
  personBody: {
    width: 24,
    height: 30,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  lostIcon: {
    alignItems: 'center',
  },
  eyeClosed: {
    width: 50,
    height: 8,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  harassedIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  personDistress: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EC4899',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  medicalIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalCross: {
    width: 8,
    height: 40,
    backgroundColor: '#EC4899',
    position: 'absolute',
  },
  medicalCrossHorizontal: {
    width: 40,
    height: 8,
    backgroundColor: '#EC4899',
    position: 'absolute',
  },
  otherIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EC4899',
    marginHorizontal: 4,
  },
  safetyIcon: {
    position: 'relative',
    width: 44,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldOuter: {
    width: 44,
    height: 50,
    backgroundColor: '#EC4899',
    borderRadius: 8,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  shieldCheck: {
    width: 12,
    height: 6,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  // Child Mode Icons
  bullyingIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  handStop: {
    width: 32,
    height: 40,
    backgroundColor: '#EC4899',
    borderRadius: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  strangerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaredIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclamationCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    borderWidth: 3,
    borderColor: '#EC4899',
  },
  contactIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EC4899',
    position: 'absolute',
  },
  phoneHandle: {
    width: 16,
    height: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    position: 'absolute',
    transform: [{ rotate: '135deg' }],
  },
  categoryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  categoryLabelText: {
    width: 100,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  categoryLabelSafety: {
    color: '#EC4899',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  navButtonActive: {
    opacity: 1,
  },
  // Bottom Nav Icons
  exploreNavIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  compassNeedle: {
    width: 2,
    height: 10,
    backgroundColor: '#6B7280',
    position: 'absolute',
  },
  homeNavIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    position: 'relative',
  },
  homeRoof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EC4899',
    position: 'absolute',
    top: 0,
  },
  homeBase: {
    width: 18,
    height: 14,
    backgroundColor: '#EC4899',
    position: 'absolute',
    bottom: 0,
    left: 3,
  },
  tipsNavIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightbulbCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6B7280',
    position: 'absolute',
    top: 0,
  },
  lightbulbBase: {
    width: 8,
    height: 6,
    backgroundColor: '#6B7280',
    position: 'absolute',
    bottom: 2,
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#EC4899',
    fontWeight: '600',
  },
});
